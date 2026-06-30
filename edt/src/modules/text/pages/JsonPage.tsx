import { useState, useCallback } from 'react'
import { Button, message, Space, Select } from 'antd'
import { FormatPainterOutlined, CompressOutlined, CheckCircleOutlined, ClearOutlined } from '@ant-design/icons'
import { SplitPanel } from '@/components/layout/SplitPanel'
import { FormatEditor } from '@/components/editor/MonacoEditor'
import { formatJson, compressJson, validateJson } from '../utils/formatters'

function formatError(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

export default function JsonPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [messageText, setMessageText] = useState('')
  const [indent, setIndent] = useState(2)

  const handleFormat = useCallback(() => {
    if (!input.trim()) { message.warning('请输入 JSON'); return }
    try {
      setOutput(formatJson(input, indent))
      setStatus('success'); setMessageText('格式化成功')
    } catch (e) { setOutput(''); setStatus('error'); setMessageText(formatError(e)) }
  }, [input, indent])

  const handleCompress = useCallback(() => {
    if (!input.trim()) { message.warning('请输入 JSON'); return }
    try {
      setOutput(compressJson(input))
      setStatus('success'); setMessageText('压缩成功')
    } catch (e) { setOutput(''); setStatus('error'); setMessageText(formatError(e)) }
  }, [input])

  const handleValidate = useCallback(() => {
    if (!input.trim()) { message.warning('请输入 JSON'); return }
    const r = validateJson(input)
    if (r.valid) { setStatus('success'); setMessageText('JSON 格式有效 ✓'); setOutput('') }
    else { setStatus('error'); setMessageText(r.error || '格式错误'); setOutput('') }
  }, [input])

  const statusBar = status !== 'idle' ? (
    <div className={`text-xs px-2 py-1 mb-1 rounded ${status === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
      {messageText}
    </div>
  ) : null

  return (
    <div className="h-full flex flex-col" style={{ padding: 12 }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium">JSON 格式化/校验</span>
        <Space>
          <Select size="small" value={indent} onChange={setIndent} style={{ width: 80 }}
            options={[{ value: 2, label: '2 空格' }, { value: 4, label: '4 空格' }, { value: 8, label: '8 空格' }]} />
          <Button size="small" icon={<ClearOutlined />} onClick={() => { setInput(''); setOutput(''); setStatus('idle') }}>清空</Button>
        </Space>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <Button type="primary" size="small" icon={<FormatPainterOutlined />} onClick={handleFormat}>格式化</Button>
        <Button size="small" icon={<CompressOutlined />} onClick={handleCompress}>压缩</Button>
        <Button size="small" icon={<CheckCircleOutlined />} onClick={handleValidate}>校验</Button>
      </div>
      <div className="flex-1 min-h-0">
        <SplitPanel
          left={
            <div className="h-full flex flex-col">
              <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
                <FormatEditor value={input} onChange={setInput} language="json" />
              </div>
            </div>
          }
          right={
            <div className="h-full flex flex-col">
              {statusBar}
              <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
                {output ? <FormatEditor value={output} language="json" readOnly /> : (
                  <div className="flex items-center justify-center h-full text-xs" style={{ color: 'var(--ant-color-text-description)' }}>格式化结果将在此显示</div>
                )}
              </div>
            </div>
          }
        />
      </div>
    </div>
  )
}
