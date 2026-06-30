import { useState, useCallback } from 'react'
import { Button, Radio } from 'antd'
import { PageHeader } from '@/components/common/PageHeader'
import { SplitPanel } from '@/components/layout/SplitPanel'
import { FormatEditor } from '@/components/editor/MonacoEditor'

export default function Base64Page() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [error, setError] = useState('')

  const handleConvert = useCallback(() => {
    if (!input.trim()) return
    setError('')
    try {
      if (mode === 'encode') {
        setOutput(btoa(input))
      } else {
        setOutput(atob(input))
      }
    } catch (e) {
      setError((e as Error).message)
      setOutput('')
    }
  }, [input, mode])

  return (
    <div className="h-full flex flex-col">
      <PageHeader title="Base64 编解码" extra={
        <Radio.Group size="small" value={mode} onChange={(e) => { setMode(e.target.value); setOutput(''); setError('') }}>
          <Radio.Button value="encode">编码</Radio.Button>
          <Radio.Button value="decode">解码</Radio.Button>
        </Radio.Group>
      } />
      <div className="flex-1 min-h-0">
        <SplitPanel
          left={
            <div className="h-full flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Button type="primary" size="small" onClick={handleConvert}>
                  {mode === 'encode' ? '编码 →' : '解码 →'}
                </Button>
                {error && <span className="text-xs text-red-500">{error}</span>}
              </div>
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
