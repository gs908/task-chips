// DAG Store - Zustand state management

import { create } from 'zustand';
import type { Node, CreateNodeInput, UpdateNodeInput } from '../../models/Node';
import { nodeService } from '../../services/NodeService';

interface HistoryEntry {
  nodes: Record<string, Node>;
  rootIds: string[];
}

interface DAGStore {
  nodes: Record<string, Node>;
  rootIds: string[];
  selectedNodeId: string | null;
  expandedNodeIds: Set<string>;
  history: HistoryEntry[];
  historyIndex: number;

  // Actions
  loadNodes: () => void;
  selectNode: (nodeId: string | null) => void;
  toggleExpanded: (nodeId: string) => void;
  createNode: (input: CreateNodeInput) => Node | null;
  updateNode: (id: string, input: UpdateNodeInput) => boolean;
  deleteNode: (id: string, cascade?: boolean) => boolean;
  addDependency: (sourceId: string, targetId: string) => boolean;
  removeDependency: (sourceId: string, targetId: string) => boolean;
  getDependencies: (nodeId: string) => Node[];
  getDependents: (nodeId: string) => Node[];
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  saveToHistory: () => void;
}

export const useDAGStore = create<DAGStore>((set, get) => ({
  nodes: {},
  rootIds: [],
  selectedNodeId: null,
  expandedNodeIds: new Set<string>(),
  history: [],
  historyIndex: -1,

  loadNodes: () => {
    const allNodes = nodeService.getAllNodes();
    const nodesMap: Record<string, Node> = {};
    for (const node of allNodes) {
      nodesMap[node.id] = node;
    }
    const rootIds = nodeService.getDAG().getRootIds();
    set({ nodes: nodesMap, rootIds });
  },

  selectNode: (nodeId) => {
    set({ selectedNodeId: nodeId });
  },

  toggleExpanded: (nodeId) => {
    const { expandedNodeIds } = get();
    const newExpanded = new Set(expandedNodeIds);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    set({ expandedNodeIds: newExpanded });
  },

  createNode: (input) => {
    get().saveToHistory();
    const node = nodeService.createNode(input);
    if (node) {
      get().loadNodes();
    }
    return node || null;
  },

  updateNode: (id, input) => {
    get().saveToHistory();
    const result = nodeService.updateNode(id, input);
    if (result) {
      get().loadNodes();
    }
    return !!result;
  },

  deleteNode: (id, cascade = false) => {
    get().saveToHistory();
    const result = nodeService.deleteNode(id, cascade);
    if (result) {
      const { selectedNodeId } = get();
      if (selectedNodeId === id) {
        set({ selectedNodeId: null });
      }
      get().loadNodes();
    }
    return result;
  },

  addDependency: (sourceId, targetId) => {
    get().saveToHistory();
    const result = nodeService.addDependency(sourceId, targetId);
    if (result) {
      get().loadNodes();
    }
    return result;
  },

  removeDependency: (sourceId, targetId) => {
    get().saveToHistory();
    const result = nodeService.removeDependency(sourceId, targetId);
    if (result) {
      get().loadNodes();
    }
    return result;
  },

  getDependencies: (nodeId) => {
    return nodeService.getDependencies(nodeId);
  },

  getDependents: (nodeId) => {
    return nodeService.getDependents(nodeId);
  },

  saveToHistory: () => {
    const { nodes, rootIds, history, historyIndex } = get();
    const entry: HistoryEntry = {
      nodes: { ...nodes },
      rootIds: [...rootIds],
    };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(entry);
    // Limit history to 50 entries
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const entry = history[historyIndex - 1];
      nodeService.importFromJSON(
        JSON.stringify({ nodes: entry.nodes, rootIds: entry.rootIds, version: '1.0.0', updatedAt: new Date().toISOString() })
      );
      set({
        historyIndex: historyIndex - 1,
        selectedNodeId: null,
      });
      get().loadNodes();
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const entry = history[historyIndex + 1];
      nodeService.importFromJSON(
        JSON.stringify({ nodes: entry.nodes, rootIds: entry.rootIds, version: '1.0.0', updatedAt: new Date().toISOString() })
      );
      set({
        historyIndex: historyIndex + 1,
        selectedNodeId: null,
      });
      get().loadNodes();
    }
  },

  canUndo: () => {
    const { historyIndex } = get();
    return historyIndex > 0;
  },

  canRedo: () => {
    const { history, historyIndex } = get();
    return historyIndex < history.length - 1;
  },
}));
