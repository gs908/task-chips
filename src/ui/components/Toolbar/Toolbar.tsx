// Toolbar component - main actions

import { useState } from 'react';
import { useDAGStore } from '../../hooks/useDAGStore';
import type { NodeType } from '../../../models/Node';

export function Toolbar() {
  const { selectedNodeId, createNode, undo, redo, canUndo, canRedo } = useDAGStore();
  const [showAddRoot, setShowAddRoot] = useState(false);
  const [newNodeTitle, setNewNodeTitle] = useState('');

  const handleAddRoot = () => {
    if (newNodeTitle.trim()) {
      createNode({
        parentId: null,
        title: newNodeTitle.trim(),
        type: 'module' as NodeType,
      });
      setNewNodeTitle('');
      setShowAddRoot(false);
    }
  };

  const handleAddChild = () => {
    if (selectedNodeId && newNodeTitle.trim()) {
      createNode({
        parentId: selectedNodeId,
        title: newNodeTitle.trim(),
        type: 'task' as NodeType,
      });
      setNewNodeTitle('');
      setShowAddRoot(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px',
        borderBottom: '1px solid #374151',
        backgroundColor: '#1f2937',
      }}
    >
      <button onClick={undo} disabled={!canUndo()} title="Undo">
        ↩
      </button>
      <button onClick={redo} disabled={!canRedo()} title="Redo">
        ↪
      </button>
      <div style={{ width: '1px', height: '24px', backgroundColor: '#374151' }} />
      {showAddRoot ? (
        <div style={{ display: 'flex', gap: '5px' }}>
          <input
            type="text"
            value={newNodeTitle}
            onChange={(e) => setNewNodeTitle(e.target.value)}
            placeholder="Node title..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                selectedNodeId ? handleAddChild() : handleAddRoot();
              }
              if (e.key === 'Escape') {
                setShowAddRoot(false);
                setNewNodeTitle('');
              }
            }}
            autoFocus
            style={{ width: '200px' }}
          />
          <button onClick={selectedNodeId ? handleAddChild : handleAddRoot}>Add</button>
          <button onClick={() => { setShowAddRoot(false); setNewNodeTitle(''); }}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setShowAddRoot(true)}>
          {selectedNodeId ? 'Add Child Node' : 'Add Root Node'}
        </button>
      )}
      {selectedNodeId && (
        <span style={{ color: '#9ca3af', fontSize: '14px' }}>
          Selected: {selectedNodeId.slice(0, 8)}...
        </span>
      )}
    </div>
  );
}
