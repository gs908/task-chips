// Cycle detection utility for DAG

/**
 * Checks if adding an edge from source to target would create a cycle
 * @param nodes - Map of node ID to node data with dependencies
 * @param sourceId - The node that would depend on target
 * @param targetId - The node that source would depend on
 * @returns true if adding this edge would create a cycle
 */
export function wouldCreateCycle(
  nodes: Map<string, { dependencies: string[] }>,
  sourceId: string,
  targetId: string
): boolean {
  // If source already depends on target, no cycle would be created
  if (sourceId === targetId) {
    return true; // Can't depend on self
  }

  // Perform DFS from target to see if we can reach source
  // If we can, adding this edge would create a cycle
  const visited = new Set<string>();
  const stack = [targetId];

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (current === sourceId) {
      return true; // Cycle detected
    }

    if (visited.has(current)) {
      continue;
    }

    visited.add(current);

    const node = nodes.get(current);
    if (node) {
      for (const dep of node.dependencies) {
        if (!visited.has(dep)) {
          stack.push(dep);
        }
      }
    }
  }

  return false;
}

/**
 * Finds all nodes that would be affected by removing a node
 * @param nodes - Map of node ID to node data
 * @param nodeId - The node being removed
 * @returns Array of node IDs that depend on this node
 */
export function findDependents(
  nodes: Map<string, { dependencies: string[] }>,
  nodeId: string
): string[] {
  const dependents: string[] = [];

  for (const [id, node] of nodes) {
    if (node.dependencies.includes(nodeId)) {
      dependents.push(id);
    }
  }

  return dependents;
}
