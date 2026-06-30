import { useState, useCallback } from 'react'
import { Button } from 'antd'
import { FormatPainterOutlined, ClearOutlined } from '@ant-design/icons'
import { PageHeader } from '@/components/common/PageHeader'
import { SplitPanel } from '@/components/layout/SplitPanel'
import { FormatEditor } from '@/components/editor/MonacoEditor'

export function EnvConfigPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  const handleFormat = useCallback(() => {
    if (!input.trim()) return
    const lines = input.split('\n')
    const result = lines.map(l => {
      const trimmed = l.trim()
      if (!trimmed || trimmed.startsWith('#')) return l
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx < 0) return l
      const key = trimmed.substring(0, eqIdx).trim()
      const val = trimmed.substring(eqIdx + 1).trim()
      // Quote if contains spaces or special chars
      const needsQuote = val.includes(' ') || val.includes('#') || val.includes("'")
      return `${key}=${needsQuote ? `"${val}"` : val}`
    }).join('\n')
    setOutput(result)
  }, [input])

  return (
    <div className="h-full flex flex-col">
      <PageHeader title=".env 文件" subtitle="环境变量配置文件格式化" />
      <div className="flex-1 min-h-0">
        <SplitPanel left={
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Button type="primary" size="small" icon={<FormatPainterOutlined />} onClick={handleFormat}>格式化</Button>
              <Button size="small" icon={<ClearOutlined />} onClick={() => { setInput(''); setOutput('') }}>清空</Button>
            </div>
            <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
              <FormatEditor value={input} onChange={setInput} language="ini" />
            </div>
          </div>
        } right={
          <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
            {output ? <FormatEditor value={output} language="ini" readOnly /> : (
              <div className="flex items-center justify-center h-full text-xs" style={{ color: 'var(--ant-color-text-description)' }}>格式化后显示</div>
            )}
          </div>
        } />
      </div>
    </div>
  )
}
