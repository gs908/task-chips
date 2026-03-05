// Topological sort utility for DAG

export interface TopologicalSortResult {
  sorted: string[];
  hasCycle: boolean;
}

/**
 * Performs topological sort on a directed acyclic graph
 * @param nodes - Array of node IDs
 * @param getDependencies - Function that returns dependencies for a given node
 * @returns Sorted array of node IDs, or null if cycle detected
 */
export function topologicalSort(
  nodes: string[],
  getDependencies: (nodeId: string) => string[]
): TopologicalSortResult {
  const visited = new Set<string>();
  const temp = new Set<string>();
  const result: string[] = [];

  function visit(nodeId: string): boolean {
    if (temp.has(nodeId)) {
      // Cycle detected
      return false;
    }
    if (visited.has(nodeId)) {
      return true;
    }

    temp.add(nodeId);

    const deps = getDependencies(nodeId);
    for (const dep of deps) {
      if (!visit(dep)) {
        return false;
      }
    }

    temp.delete(nodeId);
    visited.add(nodeId);
    result.push(nodeId);

    return true;
  }

  for (const nodeId of nodes) {
    if (!visited.has(nodeId)) {
      if (!visit(nodeId)) {
        return { sorted: [], hasCycle: true };
      }
    }
  }

  return { sorted: result.reverse(), hasCycle: false };
}
