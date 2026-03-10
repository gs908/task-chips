// Node Editor - shows node details or project info

import { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Typography, Divider, Tag, Space, Card, message } from 'antd';
import { useDAGStore } from '../../hooks/useDAGStore';
import type { Node, NodeStatus } from '../../../models/Node';

const { Title, Text } = Typography;
const { TextArea } = Input;

export function NodeEditor() {
  const { nodes, selectedNodeId, updateNode, removeDependency, getDependencies, getDependents } = useDAGStore();
  const selectedNode = selectedNodeId ? nodes[selectedNodeId] : null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<NodeStatus>('pending');
  const [context, setContext] = useState('');

  useEffect(() => {
    if (selectedNode) {
      setTitle(selectedNode.title);
      setDescription(selectedNode.description);
      setStatus(selectedNode.status);
      setContext(selectedNode.context);
    }
  }, [selectedNode]);

  // Calculate project stats
  const allNodes = Object.values(nodes);
  const rootNodes = allNodes.filter(n => !n.parentId);
  const totalTasks = allNodes.length;
  const completedTasks = allNodes.filter(n => n.status === 'done').length;
  const pendingTasks = allNodes.filter(n => n.status === 'pending').length;

  const handleSave = () => {
    if (selectedNodeId) {
      updateNode(selectedNodeId, {
        title,
        description,
        status,
        context,
      });
      message.success('Node updated successfully');
    }
  };

  const dependencies = selectedNodeId ? getDependencies(selectedNodeId) : [];
  const dependents = selectedNodeId ? getDependents(selectedNodeId) : [];

  // If no node selected, show project info
  if (!selectedNode) {
    return (
      <div style={{ padding: 16, height: '100%', overflow: 'auto' }}>
        <Title level={5}>Project Info</Title>

        <Card size="small" style={{ marginBottom: 16 }}>
          <Space orientation="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Root Nodes:</Text>
              <Text strong>{rootNodes.length}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Total Nodes:</Text>
              <Text strong>{totalTasks}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Completed:</Text>
              <Text strong style={{ color: '#52c41a' }}>{completedTasks}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Pending:</Text>
              <Text strong style={{ color: '#faad14' }}>{pendingTasks}</Text>
            </div>
          </Space>
        </Card>

        <Text type="secondary">
          Select a node to edit its properties, or click the "Add Child" button on a node to create child nodes.
        </Text>

        <Divider />

        <Text type="secondary" style={{ fontSize: 12 }}>
          Tips:
          <ul style={{ paddingLeft: 16, margin: '8px 0' }}>
            <li>Click a node to select it</li>
            <li>Use buttons on node to edit, add child, or delete</li>
            <li>Drag nodes to reposition</li>
            <li>Connect nodes using the handles</li>
            <li>Use Auto Layout button to organize nodes</li>
          </ul>
        </Text>
      </div>
    );
  }

  // Show node editor
  return (
    <div style={{ padding: 16, height: '100%', overflow: 'auto' }}>
      <Title level={5} style={{ marginBottom: 16 }}>Edit Node</Title>

      <Form layout="vertical">
        <Form.Item label="Title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Form.Item>

        <Form.Item label="Description">
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </Form.Item>

        <Form.Item label="Status">
          <Select value={status} onChange={setStatus}>
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="refining">Refining</Select.Option>
            <Select.Option value="done">Done</Select.Option>
            <Select.Option value="blocked">Blocked</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Context">
          <TextArea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={4}
            placeholder="Additional context for LLM refinement..."
          />
        </Form.Item>

        <Button type="primary" onClick={handleSave} block>
          Save Changes
        </Button>
      </Form>

      <Divider />

      <div>
        <Text strong>Dependencies ({dependencies.length})</Text>
        {dependencies.length === 0 ? (
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>No dependencies</Text>
        ) : (
          <div style={{ marginTop: 8 }}>
            {dependencies.map((dep: Node) => (
              <div key={dep.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                marginBottom: 4,
                background: '#f5f5f5',
                borderRadius: 4,
              }}>
                <Text>{dep.title}</Text>
                <Button
                  type="link"
                  size="small"
                  danger
                  onClick={() => removeDependency(selectedNode.id, dep.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Divider />

      <div>
        <Text strong>Dependents ({dependents.length})</Text>
        {dependents.length === 0 ? (
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>No dependents</Text>
        ) : (
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {dependents.map((dep: Node) => (
              <Tag key={dep.id}>{dep.title}</Tag>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
