import { useState, useCallback } from 'react'
import { Button } from 'antd'
import {
  FormatPainterOutlined,
  CheckCircleOutlined,
  ClearOutlined
} from '@ant-design/icons'
import { PageHeader } from '@/components/common/PageHeader'
import { SplitPanel } from '@/components/layout/SplitPanel'
import { FormatEditor } from '@/components/editor/MonacoEditor'
import { formatXmlText, validateXml } from '../utils/validators'

export default function XmlPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [messageText, setMessageText] = useState('')
  const [cnMessage, setCnMessage] = useState('')

  const handleFormat = useCallback(() => {
    if (!input.trim()) return
    try {
      const result = formatXmlText(input)
      setOutput(result)
      setStatus('success')
      setMessageText('格式化成功')
      setCnMessage('')
    } catch (e) {
      setOutput('')
      setStatus('error')
      setMessageText((e as Error).message)
      setCnMessage('XML 格式错误，请检查标签是否完整闭合')
    }
  }, [input])

  const handleValidate = useCallback(() => {
    if (!input.trim()) return
    const result = validateXml(input)
    if (result.valid) {
      setStatus('success')
      setMessageText('XML 格式有效 ✓')
      setCnMessage('')
      setOutput('')
    } else {
      setStatus('error')
      setMessageText(result.error || '格式错误')
      setCnMessage(result.cn || '')
      setOutput('')
    }
  }, [input])

  const handleClear = useCallback(() => {
    setInput('')
    setOutput('')
    setStatus('idle')
    setMessageText('')
  }, [])

  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="XML 格式化/校验"
        subtitle="格式化、校验 XML 数据"
        extra={
          <Button size="small" icon={<ClearOutlined />} onClick={handleClear}>清空</Button>
        }
      />
      <div className="flex-1 min-h-0">
        <SplitPanel
          left={
            <div className="h-full flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Button type="primary" size="small" icon={<FormatPainterOutlined />} onClick={handleFormat}>格式化</Button>
                <Button size="small" icon={<CheckCircleOutlined />} onClick={handleValidate}>校验</Button>
              </div>
              <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
                <FormatEditor value={input} onChange={setInput} language="xml" />
              </div>
            </div>
          }
          right={
            <div className="h-full flex flex-col">
              {status !== 'idle' && (
                <div className={`text-xs px-3 py-1.5 mb-2 rounded whitespace-pre-wrap ${
                  status === 'success'
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  <div className="font-mono">{messageText}</div>
                  {cnMessage && <div className="mt-1 pt-1 border-t border-red-300/30">⚠ {cnMessage}</div>}
                </div>
              )}
              <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
                {output ? (
                  <FormatEditor value={output} language="xml" readOnly />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs" style={{ color: 'var(--ant-color-text-description)' }}>
                    格式化后的 XML 将在此显示
                  </div>
                )}
              </div>
            </div>
          }
        />
      </div>
    </div>
  )
}
