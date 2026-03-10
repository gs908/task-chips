// Toolbar component - simplified, main actions are in App.tsx

import { Layout } from 'antd';

const { Content } = Layout;

export function Toolbar() {
  return (
    <Content style={{ padding: '8px 16px', background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
      {/* Toolbar content moved to App.tsx header */}
    </Content>
  );
}
