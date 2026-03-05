// TreeNode component - individual node in the tree

import type { Node } from '../../../models/Node';
import { useDAGStore } from '../../hooks/useDAGStore';

interface TreeNodeProps {
  node: Node;
  level: number;
}

const statusColors: Record<string, string> = {
  pending: '#9ca3af',
  refining: '#fbbf24',
  done: '#34d399',
  blocked: '#f87171',
};

export function TreeNode({ node, level }: TreeNodeProps) {
  const { nodes, selectedNodeId, selectNode, toggleExpanded, expandedNodeIds, deleteNode } = useDAGStore();
  const isExpanded = expandedNodeIds.has(node.id);
  const isSelected = selectedNodeId === node.id;
  const children = Object.values(nodes).filter((n) => n.parentId === node.id);
  const hasChildren = children.length > 0;

  const handleClick = () => {
    selectNode(node.id);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleExpanded(node.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete node "${node.title}"?`)) {
      deleteNode(node.id);
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 12px',
          cursor: 'pointer',
          backgroundColor: isSelected ? '#3b82f6' : 'transparent',
          borderRadius: '4px',
          marginLeft: level * 20,
          gap: '8px',
        }}
        onClick={handleClick}
      >
        <span
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: statusColors[node.status],
            flexShrink: 0,
          }}
          title={node.status}
        />
        {hasChildren && (
          <button
            onClick={handleToggle}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              width: '16px',
              height: '16px',
              cursor: 'pointer',
              fontSize: '12px',
              color: '#9ca3af',
            }}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        )}
        {!hasChildren && <span style={{ width: '16px' }} />}
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {node.title}
        </span>
        <button
          onClick={handleDelete}
          style={{
            background: 'none',
            border: 'none',
            padding: '2px 6px',
            cursor: 'pointer',
            fontSize: '12px',
            color: '#f87171',
            opacity: 0.7,
          }}
          title="Delete"
        >
          ✕
        </button>
      </div>
      {isExpanded && hasChildren && (
        <div>
          {children.map((child) => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
