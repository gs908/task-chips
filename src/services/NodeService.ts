// Node Service - CRUD operations for nodes

import { DAG } from '../models/DAG';
import type { Node, CreateNodeInput, UpdateNodeInput } from '../models/Node';
import { fileStorage } from '../storage/FileStorage';

export class NodeService {
  private dag: DAG;

  constructor() {
    const state = fileStorage.getState();
    this.dag = new DAG(state);
  }

  getDAG(): DAG {
    return this.dag;
  }

  getAllNodes(): Node[] {
    return this.dag.getAllNodes();
  }

  getNode(id: string): Node | undefined {
    return this.dag.getNode(id);
  }

  getRootNodes(): Node[] {
    return this.dag.getRootIds().map((id) => this.dag.getNode(id)).filter((n): n is Node => n !== undefined);
  }

  getChildren(parentId: string): Node[] {
    return this.dag.getChildren(parentId);
  }

  getDependencies(nodeId: string): Node[] {
    return this.dag.getDependencies(nodeId);
  }

  getDependents(nodeId: string): Node[] {
    return this.dag.getDependents(nodeId);
  }

  createNode(input: CreateNodeInput): Node {
    const node = this.dag.addNode(input);
    this.persist();
    return node;
  }

  updateNode(id: string, input: UpdateNodeInput): Node | undefined {
    const node = this.dag.updateNode(id, input);
    if (node) {
      this.persist();
    }
    return node;
  }

  deleteNode(id: string, cascade = false): boolean {
    const result = this.dag.deleteNode(id, cascade);
    if (result) {
      this.persist();
    }
    return result;
  }

  addDependency(sourceId: string, targetId: string): boolean {
    const result = this.dag.addDependency(sourceId, targetId);
    if (result) {
      this.persist();
    }
    return result;
  }

  removeDependency(sourceId: string, targetId: string): boolean {
    const result = this.dag.removeDependency(sourceId, targetId);
    if (result) {
      this.persist();
    }
    return result;
  }

  private persist(): void {
    fileStorage.setState(this.dag.getState());
  }

  exportToJSON(): string {
    return this.dag.toJSON();
  }

  importFromJSON(json: string): boolean {
    const newDag = DAG.fromJSON(json);
    if (newDag) {
      this.dag = newDag;
      this.persist();
      return true;
    }
    return false;
  }

  reset(): void {
    fileStorage.reset();
    this.dag = new DAG();
  }
}

export const nodeService = new NodeService();
