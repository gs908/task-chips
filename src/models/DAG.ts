// DAG model - core data structure for managing task nodes

import type { Node, CreateNodeInput, UpdateNodeInput } from './Node';
import { createNode } from './Node';
import type { DAGState } from './DAGState';
import { createInitialDAGState } from './DAGState';
import { wouldCreateCycle, findDependents } from '../utils/cycle-detection';

export class DAG {
  private state: DAGState;

  constructor(initialState?: DAGState) {
    this.state = initialState || createInitialDAGState();
  }

  getState(): DAGState {
    return this.state;
  }

  getAllNodes(): Node[] {
    return Object.values(this.state.nodes);
  }

  getNode(id: string): Node | undefined {
    return this.state.nodes[id];
  }

  getRootIds(): string[] {
    return this.state.rootIds;
  }

  getChildren(parentId: string): Node[] {
    return Object.values(this.state.nodes).filter(
      (node) => node.parentId === parentId
    );
  }

  getDependencies(nodeId: string): Node[] {
    const node = this.state.nodes[nodeId];
    if (!node) return [];
    return node.dependencies
      .map((depId) => this.state.nodes[depId])
      .filter((n): n is Node => n !== undefined);
  }

  getDependents(nodeId: string): Node[] {
    const nodesMap = new Map(Object.entries(this.state.nodes).map(([id, n]) => [id, n as { dependencies: string[] }]));
    const dependentIds = findDependents(nodesMap, nodeId);
    return dependentIds.map((id) => this.state.nodes[id]).filter((n): n is Node => n !== undefined);
  }

  addNode(input: CreateNodeInput): Node {
    const node = createNode(input);

    // Add to state
    this.state.nodes[node.id] = node;

    // Update parent's children
    if (input.parentId && this.state.nodes[input.parentId]) {
      this.state.nodes[input.parentId].children.push(node.id);
    } else if (!input.parentId) {
      // It's a root node
      this.state.rootIds.push(node.id);
    }

    this.markUpdated();
    return node;
  }

  updateNode(id: string, input: UpdateNodeInput): Node | undefined {
    const node = this.state.nodes[id];
    if (!node) return undefined;

    if (input.title !== undefined) node.title = input.title;
    if (input.description !== undefined) node.description = input.description;
    if (input.status !== undefined) node.status = input.status;
    if (input.context !== undefined) node.context = input.context;

    node.updatedAt = new Date().toISOString();
    this.markUpdated();
    return node;
  }

  deleteNode(id: string, cascade = false): boolean {
    const node = this.state.nodes[id];
    if (!node) return false;

    if (cascade) {
      // Delete all descendants
      const toDelete = this.getAllDescendants(id);
      toDelete.push(id);
      for (const nodeId of toDelete) {
        delete this.state.nodes[nodeId];
      }
    } else {
      // Move children to root
      for (const childId of node.children) {
        this.state.nodes[childId].parentId = null;
        if (!this.state.rootIds.includes(childId)) {
          this.state.rootIds.push(childId);
        }
      }
      // Remove from parent's children
      if (node.parentId && this.state.nodes[node.parentId]) {
        const parent = this.state.nodes[node.parentId];
        parent.children = parent.children.filter((cid) => cid !== id);
      }
      // Remove from rootIds if there
      this.state.rootIds = this.state.rootIds.filter((rid) => rid !== id);
      delete this.state.nodes[id];
    }

    // Clean up dependencies
    this.cleanupDependencies(id);
    this.markUpdated();
    return true;
  }

  addDependency(sourceId: string, targetId: string): boolean {
    const source = this.state.nodes[sourceId];
    const target = this.state.nodes[targetId];

    if (!source || !target) return false;
    if (source.dependencies.includes(targetId)) return false;

    // Check for cycle
    const nodesMap = new Map(
      Object.entries(this.state.nodes).map(([id, n]) => [id, n as { dependencies: string[] }])
    );
    if (wouldCreateCycle(nodesMap, sourceId, targetId)) {
      return false;
    }

    source.dependencies.push(targetId);
    source.updatedAt = new Date().toISOString();
    this.markUpdated();
    return true;
  }

  removeDependency(sourceId: string, targetId: string): boolean {
    const source = this.state.nodes[sourceId];
    if (!source) return false;

    source.dependencies = source.dependencies.filter((d) => d !== targetId);
    source.updatedAt = new Date().toISOString();
    this.markUpdated();
    return true;
  }

  private getAllDescendants(id: string): string[] {
    const result: string[] = [];
    const node = this.state.nodes[id];
    if (!node) return result;

    for (const childId of node.children) {
      result.push(childId);
      result.push(...this.getAllDescendants(childId));
    }
    return result;
  }

  private cleanupDependencies(deletedId: string): void {
    for (const node of Object.values(this.state.nodes)) {
      node.dependencies = node.dependencies.filter((d) => d !== deletedId);
    }
  }

  private markUpdated(): void {
    this.state.updatedAt = new Date().toISOString();
  }

  toJSON(): string {
    return JSON.stringify(this.state, null, 2);
  }

  static fromJSON(json: string): DAG | null {
    try {
      const state = JSON.parse(json) as DAGState;
      return new DAG(state);
    } catch {
      return null;
    }
  }
}
