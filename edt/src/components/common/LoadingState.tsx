import { Spin } from 'antd'

interface LoadingStateProps {
  tip?: string
}

export function LoadingState({ tip }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <Spin size="large" />
      {tip && <span className="text-sm text-gray-400">{tip}</span>}
    </div>
  )
}
