import { Card } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

interface ToolCardProps {
  title: string
  description?: string
  icon?: React.ReactNode
  path?: string
  onClick?: () => void
}

export function ToolCard({ title, description, icon, path, onClick }: ToolCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (path) {
      navigate(path)
    }
  }

  return (
    <Card
      hoverable
      size="small"
      onClick={handleClick}
      className="w-full"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && <span className="text-lg text-primary-500">{icon}</span>}
          <div>
            <div className="text-sm font-medium">{title}</div>
            {description && (
              <div className="text-xs text-gray-400 mt-0.5">{description}</div>
            )}
          </div>
        </div>
        <RightOutlined className="text-xs text-gray-300" />
      </div>
    </Card>
  )
}
