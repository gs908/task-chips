// TreeNode component - individual node in the tree

import { Button, Tag } from 'antd';
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
import type { Node } from '../../../models/Node';
import { useDAGStore } from '../../hooks/useDAGStore';

interface TreeNodeProps {
  node: Node;
  level: number;
}

const statusColors: Record<string, 'default' | 'processing' | 'success' | 'error'> = {
  pending: 'default',
  refining: 'processing',
  done: 'success',
  blocked: 'error',
};

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  refining: 'Refining',
  done: 'Done',
  blocked: 'Blocked',
};

export function TreeNode({ node, level }: TreeNodeProps) {
  const { nodes, selectedNodeId, selectNode, toggleExpanded, expandedNodeIds } = useDAGStore();
  const isExpanded = expandedNodeIds.has(node.id);
  const isSelected = selectedNodeId === node.id;
  const children = Object.values(nodes).filter((n) => n.parentId === node.id);
  const hasChildren = children.length > 0;

  const handleClick = () => {
    selectNode(node.id);
    // Dispatch event to focus on node in DAG
    window.dispatchEvent(new CustomEvent('dag-focus-node', { detail: { nodeId: node.id } }));
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleExpanded(node.id);
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '6px 8px',
          cursor: 'pointer',
          backgroundColor: isSelected ? '#e6f7ff' : 'transparent',
          borderRadius: 4,
          marginLeft: level * 16,
          gap: 6,
          border: isSelected ? '1px solid #1890ff' : '1px solid transparent',
        }}
        onClick={handleClick}
      >
        {hasChildren ? (
          <Button
            type="text"
            size="small"
            icon={isExpanded ? <CaretDownOutlined /> : <CaretRightOutlined />}
            onClick={handleToggle}
            style={{ padding: 0, width: 16, height: 16 }}
          />
        ) : (
          <span style={{ width: 16 }} />
        )}
        <Tag color={statusColors[node.status]} style={{ margin: 0, fontSize: 10 }}>
          {statusLabels[node.status]}
        </Tag>
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12 }}>
          {node.title}
        </span>
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
