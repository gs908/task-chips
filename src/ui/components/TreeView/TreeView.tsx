// TreeView component - container for displaying the DAG as a tree

import { useDAGStore } from '../../hooks/useDAGStore';
import { TreeNode } from './TreeNode';

export function TreeView() {
  const { nodes, rootIds, loadNodes } = useDAGStore();

  // Load nodes on mount
  if (Object.keys(nodes).length === 0) {
    loadNodes();
  }

  const rootNodes = rootIds
    .map((id) => nodes[id])
    .filter((n): n is NonNullable<typeof n> => n !== undefined);

  if (rootNodes.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>
        <p>No nodes yet. Create your first node to get started.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '10px' }}>
      {rootNodes.map((node) => (
        <TreeNode key={node.id} node={node} level={0} />
      ))}
    </div>
  );
}
