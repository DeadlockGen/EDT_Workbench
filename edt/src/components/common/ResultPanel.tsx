import { Card } from 'antd'
import { CopyButton } from './CopyButton'

interface ResultPanelProps {
  title?: string
  content: string
  extra?: React.ReactNode
}

export function ResultPanel({ title, content, extra }: ResultPanelProps) {
  return (
    <Card
      size="small"
      title={
        <div className="flex items-center justify-between">
          <span className="text-sm">{title || '输出结果'}</span>
          <CopyButton text={content} />
        </div>
      }
      extra={extra}
    >
      <pre
        className="text-xs leading-relaxed overflow-auto max-h-96 p-3 rounded"
        style={{
          backgroundColor: 'var(--ant-color-bg-layout)',
          color: 'var(--ant-color-text)',
          fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', monospace",
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          margin: 0
        }}
      >
        {content || (
          <span style={{ color: 'var(--ant-color-text-description)' }}>
            暂无输出
          </span>
        )}
      </pre>
    </Card>
  )
}
