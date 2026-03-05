// Node type definitions for DAG Task Compiler

export type NodeType = 'module' | 'task' | 'subtask';

export type NodeStatus = 'pending' | 'refining' | 'done' | 'blocked';

export interface Node {
  id: string;
  parentId: string | null;
  title: string;
  description: string;
  type: NodeType;
  status: NodeStatus;
  context: string;
  dependencies: string[];
  children: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateNodeInput {
  parentId: string | null;
  title: string;
  description?: string;
  type: NodeType;
}

export interface UpdateNodeInput {
  title?: string;
  description?: string;
  status?: NodeStatus;
  context?: string;
}

export function createNode(input: CreateNodeInput): Node {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    parentId: input.parentId,
    title: input.title,
    description: input.description || '',
    type: input.type,
    status: 'pending',
    context: '',
    dependencies: [],
    children: [],
    createdAt: now,
    updatedAt: now,
  };
}
