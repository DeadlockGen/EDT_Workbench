import { Layout, Space, theme } from 'antd'
import { SunOutlined, MoonOutlined } from '@ant-design/icons'
import { useAppStore } from '../stores/app.store'
import { useLocation } from 'react-router-dom'

const { Header } = Layout

const moduleTitles: Record<string, string> = {
  '/text': '文本处理',
  '/encode': '编码工具',
  '/config-files': '配置文件',
  '/linux': 'Linux',
  '/docker': 'Docker / K8S',
  '/redis': 'Redis',
  '/excel': 'Excel',
  '/image': '图片',
  '/scripts': '脚本中心'
}

export function Toolbar() {
  const appTheme = useAppStore((s) => s.theme)
  const setTheme = useAppStore((s) => s.setTheme)
  const location = useLocation()
  const { token } = theme.useToken()

  const moduleTitle = Object.entries(moduleTitles).find(([path]) =>
    location.pathname.startsWith(path)
  )?.[1]

  return (
    <Header
      className="flex items-center justify-between px-3 border-b"
      style={{
        height: 36,
        lineHeight: '36px',
        background: token.colorBgContainer,
        borderColor: token.colorBorderSecondary
      }}
    >
      <div className="text-xs font-medium" style={{ color: 'var(--ant-color-text-secondary)' }}>
        {moduleTitle || ''}
      </div>
      <Space size="small">
        <div
          className="flex items-center gap-1 cursor-pointer px-1.5 py-0.5 rounded text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => setTheme(appTheme === 'dark' ? 'light' : 'dark')}
          style={{ color: 'var(--ant-color-text-secondary)' }}
        >
          {appTheme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
        </div>
      </Space>
    </Header>
  )
}
