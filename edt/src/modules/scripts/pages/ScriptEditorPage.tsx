import { Empty } from 'antd'
import { PageHeader } from '@/components/common/PageHeader'

export default function ScriptEditorPage() {
  return (
    <div>
      <PageHeader title="脚本编辑器" subtitle="编辑执行脚本" />
      <div className="flex items-center justify-center h-96">
        <Empty description="脚本编辑器" />
      </div>
    </div>
  )
}
