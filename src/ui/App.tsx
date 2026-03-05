// Main App component

import { useEffect } from 'react';
import { Toolbar } from './components/Toolbar/Toolbar';
import { TreeView } from './components/TreeView/TreeView';
import { NodeEditor } from './components/NodeEditor/NodeEditor';
import { useDAGStore } from './hooks/useDAGStore';

function App() {
  const { loadNodes } = useDAGStore();

  useEffect(() => {
    loadNodes();
  }, [loadNodes]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#111827' }}>
      <header style={{ padding: '10px 20px', borderBottom: '1px solid #374151' }}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>DAG Task Compiler</h1>
        <p style={{ margin: '5px 0 0', fontSize: '14px', color: '#9ca3af' }}>
          State-Driven Task Compiler for AI Agents
        </p>
      </header>

      <Toolbar />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: '1 1 50%', borderRight: '1px solid #374151', overflow: 'auto' }}>
          <TreeView />
        </div>
        <div style={{ flex: '1 1 50%', overflow: 'auto' }}>
          <NodeEditor />
        </div>
      </div>
    </div>
  );
}

export default App;
