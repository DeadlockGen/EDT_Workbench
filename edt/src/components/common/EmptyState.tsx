import { Result } from 'antd'

interface EmptyStateProps {
  title?: string
  description?: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Result
        status="info"
        title={title || '暂无数据'}
        subTitle={description || '当前页面没有可显示的内容'}
      />
    </div>
  )
}
