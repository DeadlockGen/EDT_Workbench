import { useState, useCallback } from 'react'
import { Button, Space } from 'antd'
import { nanoid } from 'nanoid'
import { customAlphabet } from 'nanoid'
import { PageHeader } from '@/components/common/PageHeader'
import { ResultPanel } from '@/components/common/ResultPanel'

export default function NanoIdPage() {
  const [ids, setIds] = useState<string[]>([])
  const [alphabet] = useState('default')
  const [size] = useState(21)

  const generate = useCallback((count: number) => {
    const gen: () => string = alphabet === 'default'
      ? () => nanoid(size)
      : alphabet === 'hex'
        ? customAlphabet('0123456789abcdef', size)
        : alphabet === 'numbers'
          ? customAlphabet('0123456789', size)
          : customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', size)

    setIds(Array.from({ length: count }, gen))
  }, [alphabet, size])

  return (
    <div className="h-full flex flex-col">
      <PageHeader title="NanoID 生成" subtitle="轻量级唯一 ID 生成器" extra={
        <Space>
          <Button size="small" onClick={() => generate(1)}>生成 1 个</Button>
          <Button size="small" onClick={() => generate(5)}>生成 5 个</Button>
          <Button size="small" onClick={() => generate(20)}>生成 20 个</Button>
        </Space>
      } />
      {ids.length > 0 && (
        <ResultPanel
          title={`NanoID (${ids.length} 个)`}
          content={ids.join('\n')}
        />
      )}
    </div>
  )
}
