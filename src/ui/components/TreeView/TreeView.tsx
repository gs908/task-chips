// TreeView component - container for displaying the DAG as a tree

import { Empty } from 'antd';
import { useDAGStore } from '../../hooks/useDAGStore';
import { TreeNode } from './TreeNode';

export function TreeView() {
  const { nodes, rootIds } = useDAGStore();

  const rootNodes = rootIds
    .map((id) => nodes[id])
    .filter((n): n is NonNullable<typeof n> => n !== undefined);

  if (rootNodes.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <Empty description="No nodes yet" />
      </div>
    );
  }

  return (
    <div style={{ padding: '8px' }}>
      {rootNodes.map((node) => (
        <TreeNode key={node.id} node={node} level={0} />
      ))}
    </div>
  );
}
