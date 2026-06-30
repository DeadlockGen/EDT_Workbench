import { Typography, Space } from 'antd'

const { Title } = Typography

interface PageHeaderProps {
  title: string
  subtitle?: string
  extra?: React.ReactNode
}

export function PageHeader({ title, subtitle, extra }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <Space direction="vertical" size={2}>
        <Title level={4} style={{ margin: 0 }}>
          {title}
        </Title>
        {subtitle && (
          <span className="text-xs" style={{ color: 'var(--ant-color-text-description)' }}>
            {subtitle}
          </span>
        )}
      </Space>
      {extra && <div>{extra}</div>}
    </div>
  )
}
