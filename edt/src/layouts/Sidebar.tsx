import { useNavigate, useLocation } from 'react-router-dom'
import { Layout } from 'antd'
import {
  FileTextOutlined,
  LockOutlined,
  LinuxOutlined,
  SettingOutlined,
  DockerOutlined,
  DatabaseOutlined,
  PictureOutlined,
  TableOutlined,
  CodeOutlined,
  FileWordOutlined
} from '@ant-design/icons'
import { useAppStore } from '../stores/app.store'

const { Sider } = Layout

const navItems = [
  { key: 'text', label: '文本处理', icon: <FileTextOutlined />, path: '/text' },
  { key: 'encode', label: '编码工具', icon: <LockOutlined />, path: '/encode' },
  { key: 'config', label: '配置文件', icon: <SettingOutlined />, path: '/config-files' },
  { key: 'linux', label: 'Linux', icon: <LinuxOutlined />, path: '/linux' },
  { key: 'docker', label: 'Docker / K8S', icon: <DockerOutlined />, path: '/docker' },
  { key: 'redis', label: 'Redis', icon: <DatabaseOutlined />, path: '/redis' },
  { key: 'excel', label: 'Excel', icon: <TableOutlined />, path: '/excel' },
  { key: 'word', label: 'Word', icon: <FileWordOutlined />, path: '/word' },
  { key: 'image', label: '图片', icon: <PictureOutlined />, path: '/image' },
  { key: 'scripts', label: '脚本中心', icon: <CodeOutlined />, path: '/scripts' }
]

export function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const collapsed = useAppStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)

  const selectedKey = navItems.find((item) =>
    location.pathname.startsWith(item.path)
  )?.key

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={toggleSidebar}
      collapsedWidth={48}
      width={200}
      className="border-r select-none sider-custom"
      style={{
        overflow: 'hidden',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        background: 'var(--ant-color-bg-container)'
      }}
    >
      {/* Brand */}
      <div
        className="flex items-center cursor-pointer border-b h-11 px-4"
        style={{ borderColor: 'var(--ant-color-border-secondary)' }}
        onClick={() => navigate('/')}
      >
        {collapsed ? (
          <span className="text-sm font-bold" style={{ color: 'var(--ant-color-primary)' }}>E</span>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">EDT</span>
            <span className="text-2xs" style={{ color: 'var(--ant-color-text-description)' }}>部署工作台</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="overflow-y-auto overflow-x-hidden" style={{ height: 'calc(100vh - 88px)' }}>
        {navItems.map((item) => (
          <div
            key={item.key}
            onClick={() => navigate(item.path)}
            className={`flex items-center cursor-pointer select-none text-xs
              ${collapsed ? 'justify-center px-0 h-10' : 'px-4 gap-2.5 h-7'}
              ${selectedKey === item.key
                ? 'nav-item-selected'
                : 'nav-item'
              }`}
            title={collapsed ? item.label : undefined}
          >
            <span className="text-sm">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </div>
        ))}
      </div>

      {/* Settings at bottom */}
      <div
        onClick={() => navigate('/settings')}
        className={`flex items-center cursor-pointer select-none text-xs h-9 border-t transition-colors
          ${collapsed ? 'justify-center' : 'px-4 gap-2.5'}
          settings-item`}
        style={{ borderColor: 'var(--ant-color-border-secondary)' }}
        title="设置"
      >
        <span className="text-sm"><SettingOutlined /></span>
        {!collapsed && <span>设置</span>}
      </div>
    </Sider>
  )
}
