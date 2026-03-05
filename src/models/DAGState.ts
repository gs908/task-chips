// DAG State type definitions

import type { Node } from './Node';

export interface DAGState {
  nodes: Record<string, Node>;
  rootIds: string[];
  version: string;
  updatedAt: string;
}

export interface CompiledTask {
  id: string;
  title: string;
  description: string;
  type: string;
  parentGoal: string;
  dependencies: string[];
  dependencyOutputs: string[];
  order: number;
}

export interface TaskList {
  tasks: CompiledTask[];
  compiledAt: string;
  totalCount: number;
}

export function createInitialDAGState(): DAGState {
  return {
    nodes: {},
    rootIds: [],
    version: '1.0.0',
    updatedAt: new Date().toISOString(),
  };
}
