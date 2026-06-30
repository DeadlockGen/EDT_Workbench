import { useState, useCallback } from 'react'
import { Button, Space } from 'antd'
import { v4 as uuidv4, v1 as uuidv1 } from 'uuid'
import { PageHeader } from '@/components/common/PageHeader'
import { ResultPanel } from '@/components/common/ResultPanel'

export default function UuidPage() {
  const [uuids, setUuids] = useState<string[]>([])

  const generate = useCallback((count: number, version: 'v4' | 'v1') => {
    const list = Array.from({ length: count }, () =>
      version === 'v4' ? uuidv4() : uuidv1()
    )
    setUuids(list)
  }, [])

  return (
    <div className="h-full flex flex-col">
      <PageHeader title="UUID 生成" subtitle="生成 UUID v4（随机）和 v1（基于时间）" extra={
        <Space>
          <Button size="small" onClick={() => generate(1, 'v4')}>生成 1 个</Button>
          <Button size="small" onClick={() => generate(5, 'v4')}>生成 5 个</Button>
          <Button size="small" onClick={() => generate(10, 'v4')}>生成 10 个</Button>
        </Space>
      } />
      {uuids.length > 0 && (
        <ResultPanel
          title={`UUID (${uuids.length} 个)`}
          content={uuids.join('\n')}
        />
      )}
    </div>
  )
}
