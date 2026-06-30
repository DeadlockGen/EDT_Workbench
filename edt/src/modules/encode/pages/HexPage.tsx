import { useState, useCallback } from 'react'
import { Button, Select } from 'antd'
import { SplitPanel } from '@/components/layout/SplitPanel'
import { FormatEditor } from '@/components/editor/MonacoEditor'

const converters: Record<string, (s: string) => string> = {
  'hex2str': (s) => {
    const hex = s.replace(/\s+/g, '')
    return Buffer.from(hex, 'hex').toString('utf-8')
  },
  'str2hex': (s) => Buffer.from(s, 'utf-8').toString('hex').replace(/(..)/g, '$1 ').trim(),
  'hex2dec': (s) => String(parseInt(s.replace(/\s+/g, ''), 16)),
  'dec2hex': (s) => parseInt(s).toString(16).toUpperCase()
}

export default function HexPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState('str2hex')

  const handleConvert = useCallback(() => {
    if (!input.trim()) return
    try {
      setOutput(converters[mode](input))
    } catch (e) {
      setOutput('转换失败: ' + (e as Error).message)
    }
  }, [input, mode])

  return (
    <div className="h-full flex flex-col" style={{ padding: 12 }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium">Hex 转换</span>
        <Select size="small" value={mode} onChange={setMode} style={{ width: 140 }}
          options={[
            { value: 'str2hex', label: '文本 → Hex' },
            { value: 'hex2str', label: 'Hex → 文本' },
            { value: 'dec2hex', label: '十进制 → Hex' },
            { value: 'hex2dec', label: 'Hex → 十进制' }
          ]} />
      </div>
      <div className="flex-1 min-h-0">
        <SplitPanel
          left={
            <div className="h-full flex flex-col">
              <Button type="primary" size="small" className="mb-2 self-start" onClick={handleConvert}>转换 →</Button>
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
