import { useState, useCallback } from 'react'
import { Button, Radio } from 'antd'
import { SplitPanel } from '@/components/layout/SplitPanel'
import { FormatEditor } from '@/components/editor/MonacoEditor'

export default function UrlPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const handleConvert = useCallback(() => {
    if (!input.trim()) return
    try {
      setOutput(mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input))
    } catch (e) {
      setOutput('解码失败: ' + (e as Error).message)
    }
  }, [input, mode])

  return (
    <div className="h-full flex flex-col" style={{ padding: 12 }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium">URL 编解码</span>
        <Radio.Group size="small" value={mode} onChange={(e) => { setMode(e.target.value); setOutput('') }}>
          <Radio.Button value="encode">编码</Radio.Button>
          <Radio.Button value="decode">解码</Radio.Button>
        </Radio.Group>
      </div>
      <div className="flex-1 min-h-0">
        <SplitPanel
          left={
            <div className="h-full flex flex-col">
              <Button type="primary" size="small" className="mb-2 self-start" onClick={handleConvert}>
                {mode === 'encode' ? '编码 →' : '解码 →'}
              </Button>
              <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
                <FormatEditor value={input} onChange={setInput} language="plaintext" />
              </div>
            </div>
          }
          right={
            <div className="h-full flex flex-col">
              <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
                <FormatEditor value={output} language="plaintext" readOnly />
              </div>
            </div>
          }
        />
      </div>
    </div>
  )
}
