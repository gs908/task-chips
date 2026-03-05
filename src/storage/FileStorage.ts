// File storage service for persisting DAG state to JSON

import type { DAGState } from '../models/DAGState';
import { createInitialDAGState } from '../models/DAGState';

const STORAGE_KEY = 'dag-task-compiler-data';

export class FileStorage {
  private data: DAGState;

  constructor() {
    this.data = this.load();
  }

  private load(): DAGState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
    }
    return createInitialDAGState();
  }

  private save(): void {
    try {
      this.data.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error('Failed to save data to localStorage:', error);
    }
  }

  getState(): DAGState {
    return this.data;
  }

  setState(state: DAGState): void {
    this.data = state;
    this.save();
  }

  getNodes(): Record<string, unknown> {
    return this.data.nodes;
  }

  getNode(id: string): unknown | undefined {
    return this.data.nodes[id];
  }

  setNode(id: string, node: unknown): void {
    this.data.nodes[id] = node as never;
    this.save();
  }

  deleteNode(id: string): void {
    delete this.data.nodes[id];
    this.save();
  }

  getRootIds(): string[] {
    return this.data.rootIds;
  }

  addRootId(id: string): void {
    if (!this.data.rootIds.includes(id)) {
      this.data.rootIds.push(id);
      this.save();
    }
  }

  removeRootId(id: string): void {
    this.data.rootIds = this.data.rootIds.filter((rid) => rid !== id);
    this.save();
  }

  exportToJSON(): string {
    return JSON.stringify(this.data, null, 2);
  }

  importFromJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.nodes && parsed.rootIds) {
        this.data = parsed;
        this.save();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  reset(): void {
    this.data = createInitialDAGState();
    this.save();
  }
}

export const fileStorage = new FileStorage();
