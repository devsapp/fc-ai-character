import { Outlet, useLocation } from '@umijs/max';
import { Card, ConfigProvider, Layout } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import './layout.less';
const { Content } = Layout;

export default function Index() {
  const location = useLocation();

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: { colorPrimary: '#2e93e9', colorInfo: '#2e93e9' },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Layout style={{ height: '100%' }}>
          <Content
            style={{
              height: '100%',
              maxHeight: '100vh',
              overflow: 'auto',
            }}
          >
            <Card style={{ margin: 50 }}>
              <Outlet />
            </Card>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
