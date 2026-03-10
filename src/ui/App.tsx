// Main App component

import { useEffect, useCallback, useState } from 'react';
import { Layout, Typography, Button, Space, Tooltip, Switch, Dropdown, type MenuProps } from 'antd';
import { UndoOutlined, RedoOutlined, ColumnWidthOutlined, DatabaseOutlined, UnorderedListOutlined, CloseOutlined, AppstoreOutlined } from '@ant-design/icons';

import { DAGFlow } from './components/DAGFlow/DAGFlow';
import { NodeEditor } from './components/NodeEditor/NodeEditor';
import { TreeView } from './components/TreeView/TreeView';
import { useDAGStore } from './hooks/useDAGStore';
import { nodeService } from '../services/NodeService';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

export type LayoutDirection = 'horizontal' | 'vertical';

// Glass morphism button style
const glassButtonStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  color: '#fff',
  backdropFilter: 'blur(10px)',
  borderRadius: '8px',
  transition: 'all 0.3s ease',
};

// Sample data
const sampleData = {
  version: '1.0.0',
  nodes: {
    'root-1': {
      id: 'root-1',
      parentId: null,
      title: '学生管理系统',
      description: '基于角色的权限管理和学生信息管理系统',
      type: 'module',
      status: 'pending',
      context: '',
      dependencies: [],
      children: ['role-module', 'student-module', 'auth-module'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    'role-module': {
      id: 'role-module',
      parentId: 'root-1',
      title: '角色权限模块',
      description: '管理系统角色和权限分配',
      type: 'module',
      status: 'pending',
      context: '',
      dependencies: [],
      children: ['role-list', 'role-create', 'role-edit', 'permission-assign'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    'student-module': {
      id: 'student-module',
      parentId: 'root-1',
      title: '学生信息模块',
      description: '管理学生基本信息和学籍',
      type: 'module',
      status: 'pending',
      context: '',
      dependencies: ['role-module'],
      children: ['student-list', 'student-create', 'student-edit', 'student-import'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    'auth-module': {
      id: 'auth-module',
      parentId: 'root-1',
      title: '认证授权模块',
      description: '用户登录认证和JWT令牌管理',
      type: 'module',
      status: 'pending',
      context: '',
      dependencies: [],
      children: ['login', 'logout', 'token-refresh', 'password-reset'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    'role-list': {
      id: 'role-list',
      parentId: 'role-module',
      title: '角色列表',
      description: '展示所有角色，支持搜索和筛选',
      type: 'task',
      status: 'pending',
      context: '',
      dependencies: [],
      children: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    'role-create': {
      id: 'role-create',
      parentId: 'role-module',
      title: '创建角色',
      description: '新建角色并分配基础权限',
      type: 'task',
      status: 'pending',
      context: '',
      dependencies: [],
      children: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    'role-edit': {
      id: 'role-edit',
      parentId: 'role-module',
      title: '编辑角色',
      description: '修改角色信息和权限',
      type: 'task',
      status: 'pending',
      context: '',
      dependencies: ['role-list'],
      children: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    'permission-assign': {
      id: 'permission-assign',
      parentId: 'role-module',
      title: '权限分配',
      description: '为角色分配细粒度权限',
      type: 'task',
      status: 'pending',
      context: '',
      dependencies: ['role-list'],
      children: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    'student-list': {
      id: 'student-list',
      parentId: 'student-module',
      title: '学生列表',
      description: '展示所有学生信息，支持分页和搜索',
      type: 'task',
      status: 'pending',
      context: '',
      dependencies: [],
      children: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    'student-create': {
      id: 'student-create',
      parentId: 'student-module',
      title: '添加学生',
      description: '新增学生基本信息',
      type: 'task',
      status: 'pending',
      context: '',
      dependencies: ['student-list'],
      children: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    'student-edit': {
      id: 'student-edit',
      parentId: 'student-module',
      title: '编辑学生',
      description: '修改学生信息和学籍状态',
      type: 'task',
      status: 'pending',
      context: '',
      dependencies: ['student-list'],
      children: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    'student-import': {
      id: 'student-import',
      parentId: 'student-module',
      title: '批量导入',
      description: '通过Excel批量导入学生数据',
      type: 'task',
      status: 'pending',
      context: '',
      dependencies: ['student-list'],
      children: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    'login': {
      id: 'login',
      parentId: 'auth-module',
      title: '用户登录',
      description: '用户名密码登录，返回JWT令牌',
      type: 'task',
      status: 'pending',
      context: '',
      dependencies: [],
      children: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    'logout': {
      id: 'logout',
      parentId: 'auth-module',
      title: '退出登录',
      description: '清除Token，销毁会话',
      type: 'task',
      status: 'pending',
      context: '',
      dependencies: ['login'],
      children: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    'token-refresh': {
      id: 'token-refresh',
      parentId: 'auth-module',
      title: 'Token刷新',
      description: '自动刷新即将过期的JWT令牌',
      type: 'task',
      status: 'pending',
      context: '',
      dependencies: ['login'],
      children: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    'password-reset': {
      id: 'password-reset',
      parentId: 'auth-module',
      title: '密码重置',
      description: '通过邮箱验证码重置密码',
      type: 'task',
      status: 'pending',
      context: '',
      dependencies: ['login'],
      children: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  rootIds: ['root-1'],
  updatedAt: new Date().toISOString()
};

function AppContent() {
  const { loadNodes, canUndo, canRedo, undo, redo, createNode } = useDAGStore();
  
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [treePanelOpen, setTreePanelOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [layoutDirection, setLayoutDirection] = useState<LayoutDirection>('vertical');

  useEffect(() => {
    loadNodes();
  }, [loadNodes]);

  useEffect(() => {
    if (!initialized) {
      const allNodes = nodeService.getAllNodes();
      if (allNodes.length === 0) {
        setInitialized(true);
        createNode({
          parentId: null,
          title: '我的项目',
          type: 'module',
        });
      } else {
        setInitialized(true);
      }
    }
  }, [initialized, createNode]);


  const handleClearAndCreateSample = useCallback(() => {
    nodeService.reset();
    nodeService.importFromJSON(JSON.stringify(sampleData));
    loadNodes();
    // X6 handles auto-fit internally
  }, [loadNodes]);

  const sampleMenuItems: MenuProps['items'] = [
    {
      key: 'sample',
      label: '学生管理系统',
      icon: <DatabaseOutlined />,
      onClick: handleClearAndCreateSample,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, rgba(0, 21, 41, 0.95) 0%, rgba(0, 33, 64, 0.9) 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
        zIndex: 10,
        lineHeight: 1.2,
      }}>
        <Space size={12}>
          <div style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1890ff 0%, #52c41a 100%)',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(24, 144, 255, 0.4)',
          }}>
            <AppstoreOutlined style={{ fontSize: 20, color: '#fff' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <Title level={4} style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 600, whiteSpace: 'nowrap' }}>
              DAG Task Compiler
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, whiteSpace: 'nowrap' }}>
              State-Driven Task Compiler for AI Agents
            </Text>
          </div>
        </Space>
        <Space size={10}>
          {/* Floating Tree Panel Dropdown */}
          <Dropdown
            popupRender={() => (
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: 12,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '8px',
                maxHeight: 400,
                overflow: 'auto',
                minWidth: 280,
              }}>
                <TreeView />
              </div>
            )}
            trigger={['click']}
            open={treePanelOpen}
            onOpenChange={setTreePanelOpen}
            placement="bottomLeft"
          >
            <Button
              icon={<UnorderedListOutlined />}
              style={glassButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              节点导航
            </Button>
          </Dropdown>

          <Dropdown menu={{ items: sampleMenuItems }} trigger={['click']}>
            <Button
              icon={<DatabaseOutlined />}
              style={glassButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              加载示例
            </Button>
          </Dropdown>

          <Tooltip title="布局切换">
            <Switch
              checked={layoutDirection === 'horizontal'}
              onChange={(checked) => setLayoutDirection(checked ? 'horizontal' : 'vertical')}
              checkedChildren="H"
              unCheckedChildren="V"
              style={{ height: 22, lineHeight: '22px' }}
            />
          </Tooltip>

          <Tooltip title="自动布局">
            <Button
              icon={<ColumnWidthOutlined />}
              
              style={glassButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            />
          </Tooltip>

          <Tooltip title="撤销">
            <Button
              icon={<UndoOutlined />}
              onClick={undo}
              disabled={!canUndo()}
              style={{
                ...glassButtonStyle,
                opacity: canUndo() ? 1 : 0.4,
              }}
              onMouseEnter={(e) => {
                if (canUndo()) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            />
          </Tooltip>

          <Tooltip title="重做">
            <Button
              icon={<RedoOutlined />}
              onClick={redo}
              disabled={!canRedo()}
              style={{
                ...glassButtonStyle,
                opacity: canRedo() ? 1 : 0.4,
              }}
              onMouseEnter={(e) => {
                if (canRedo()) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            />
          </Tooltip>
        </Space>
      </Header>
      <Layout style={{ height: 'calc(100vh - 64px)' }}>
        <Content style={{ flex: 1 }}>
          <DAGFlow layoutDirection={layoutDirection} />
        </Content>
        <Sider
          width={350}
          collapsedWidth={48}
          collapsible
          collapsed={rightSidebarCollapsed}
          onCollapse={setRightSidebarCollapsed}
          trigger={null}
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '-4px 0 30px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {!rightSidebarCollapsed ? (
              <>
                <div style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(255, 255, 255, 0.5)',
                }}>
                  <Text strong style={{ fontSize: 14 }}>属性</Text>
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={() => setRightSidebarCollapsed(true)}
                    size="small"
                    style={{ color: 'rgba(0, 0, 0, 0.45)' }}
                  />
                </div>
                <NodeEditor />
              </>
            ) : (
              <div style={{ padding: '8px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <Tooltip title="属性" placement="left">
                  <Button
                    type="text"
                    onClick={() => setRightSidebarCollapsed(false)}
                    style={{ color: 'rgba(0, 0, 0, 0.65)' }}
                  >
                    <UnorderedListOutlined style={{ fontSize: 18 }} />
                  </Button>
                </Tooltip>
              </div>
            )}
          </div>
        </Sider>
      </Layout>
    </Layout>
  );
}

function App() {
  return (
    
      <AppContent />
    
  );
}

export default App;
