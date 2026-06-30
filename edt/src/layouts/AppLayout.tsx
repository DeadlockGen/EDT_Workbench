import { Layout } from 'antd'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Toolbar } from './Toolbar'
import { useAppStore } from '../stores/app.store'

const { Content } = Layout

export function AppLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const collapsed = useAppStore((s) => s.sidebarCollapsed)

  return (
    <Layout className="h-screen" style={{ overflow: 'hidden' }}>
      <Sidebar />
      <Layout style={{
        marginLeft: collapsed ? 48 : 200,
        transition: 'margin-left 0.2s ease'
      }}>
        <Toolbar />
        <Content
          style={{
            background: 'var(--ant-color-bg-container)',
            height: 'calc(100vh - 36px)',
            overflow: 'auto'
          }}
        >
          {isHome ? (
            <div className="flex flex-col items-center justify-center h-full select-none">
              <div className="text-5xl font-light mb-4 tracking-wider" style={{ color: 'var(--ant-color-text-quaternary)' }}>EDT</div>
              <div className="text-sm" style={{ color: 'var(--ant-color-text-description)' }}>从左侧选择一个模块开始工作</div>
            </div>
          ) : (
            <Outlet />
          )}
        </Content>
      </Layout>
    </Layout>
  )
}
