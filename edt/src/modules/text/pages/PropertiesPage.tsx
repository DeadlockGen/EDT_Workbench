import { useState, useCallback } from 'react'
import { Button } from 'antd'
import { FormatPainterOutlined, ClearOutlined } from '@ant-design/icons'
import { PageHeader } from '@/components/common/PageHeader'
import { SplitPanel } from '@/components/layout/SplitPanel'
import { FormatEditor } from '@/components/editor/MonacoEditor'

// Properties formatter
function formatProperties(input: string): string {
  const lines = input.split('\n')
  const result: string[] = []

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (!line.trim() || line.trim().startsWith('#') || line.trim().startsWith('!')) {
      result.push(line)
      continue
    }

    const sepIndex = findSeparator(line)
    if (sepIndex >= 0) {
      const key = line.substring(0, sepIndex).trimEnd()
      const value = line.substring(sepIndex + 1).trimStart()
      result.push(`${key}=${value}`)
    } else {
      result.push(line)
    }
  }

  return result.join('\n')
}

function findSeparator(line: string): number {
  const eqIdx = line.indexOf('=')
  const colonIdx = line.indexOf(':')
  if (eqIdx < 0 && colonIdx < 0) return -1
  if (eqIdx < 0) return colonIdx
  if (colonIdx < 0) return eqIdx
  return Math.min(eqIdx, colonIdx)
}

function validateProperties(input: string): { valid: boolean; error?: string } {
  const lines = input.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line || line.startsWith('#') || line.startsWith('!')) continue
    if (line.includes('=') || line.includes(':')) continue
    return { valid: false, error: `第 ${i + 1} 行格式无效: ${line}` }
  }
  return { valid: true }
}

export default function PropertiesPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [messageText, setMessageText] = useState('')

  const handleFormat = useCallback(() => {
    if (!input.trim()) return
    try {
      const result = formatProperties(input)
      setOutput(result)
      setStatus('success')
      setMessageText('格式化成功')
    } catch (e) {
      setStatus('error')
      setMessageText((e as Error).message)
    }
  }, [input])

  const handleValidate = useCallback(() => {
    if (!input.trim()) return
    const result = validateProperties(input)
    if (result.valid) {
      setStatus('success')
      setMessageText('Properties 格式有效 ✓')
    } else {
      setStatus('error')
      setMessageText(result.error || '格式错误')
    }
    setOutput('')
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
        title="Properties 格式化"
        subtitle="格式化 Java Properties 配置文件"
        extra={<Button size="small" icon={<ClearOutlined />} onClick={handleClear}>清空</Button>}
      />
      <div className="flex-1 min-h-0">
        <SplitPanel
          left={
            <div className="h-full flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Button type="primary" size="small" icon={<FormatPainterOutlined />} onClick={handleFormat}>格式化</Button>
                <Button size="small" onClick={handleValidate}>校验</Button>
              </div>
              <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
                <FormatEditor value={input} onChange={setInput} language="properties" />
              </div>
            </div>
          }
          right={
            <div className="h-full flex flex-col">
              {status !== 'idle' && (
                <div className={`text-xs px-3 py-1.5 mb-2 rounded ${
                  status === 'success'
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>{messageText}</div>
              )}
              <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
                {output ? (
                  <FormatEditor value={output} language="properties" readOnly />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs" style={{ color: 'var(--ant-color-text-description)' }}>
                    格式化后的 Properties 将在此显示
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
