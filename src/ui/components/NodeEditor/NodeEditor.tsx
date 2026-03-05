// NodeEditor component - edit node details

import { useState, useEffect } from 'react';
import { useDAGStore } from '../../hooks/useDAGStore';
import type { Node, NodeStatus } from '../../../models/Node';

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

  if (!selectedNode) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>
        <p>Select a node to edit</p>
      </div>
    );
  }

  const dependencies = getDependencies(selectedNode.id);
  const dependents = getDependents(selectedNode.id);

  const handleSave = () => {
    updateNode(selectedNode.id, {
      title,
      description,
      status,
      context,
    });
  };

  return (
    <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <h3 style={{ margin: 0 }}>Edit Node</h3>

      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ width: '100%', resize: 'vertical' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as NodeStatus)} style={{ width: '100%' }}>
          <option value="pending">Pending</option>
          <option value="refining">Refining</option>
          <option value="done">Done</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Context</label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={4}
          placeholder="Additional context for LLM refinement..."
          style={{ width: '100%', resize: 'vertical' }}
        />
      </div>

      <button onClick={handleSave}>Save Changes</button>

      <div style={{ borderTop: '1px solid #374151', paddingTop: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Dependencies ({dependencies.length})</h4>
        {dependencies.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#9ca3af' }}>No dependencies</p>
        ) : (
          <ul style={{ fontSize: '13px', paddingLeft: '20px', margin: 0 }}>
            {dependencies.map((dep: Node) => (
              <li key={dep.id} style={{ marginBottom: '5px' }}>
                {dep.title}
                <button
                  onClick={() => removeDependency(selectedNode.id, dep.id)}
                  style={{ marginLeft: '10px', padding: '2px 6px', fontSize: '11px' }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ borderTop: '1px solid #374151', paddingTop: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Dependents ({dependents.length})</h4>
        {dependents.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#9ca3af' }}>No dependents</p>
        ) : (
          <ul style={{ fontSize: '13px', paddingLeft: '20px', margin: 0 }}>
            {dependents.map((dep: Node) => (
              <li key={dep.id} style={{ marginBottom: '5px' }}>
                {dep.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
