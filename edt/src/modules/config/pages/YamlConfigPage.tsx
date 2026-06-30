import { useState, useCallback } from 'react'
import { Button } from 'antd'
import { FormatPainterOutlined, CheckCircleOutlined, ClearOutlined } from '@ant-design/icons'
import { PageHeader } from '@/components/common/PageHeader'
import { SplitPanel } from '@/components/layout/SplitPanel'
import { FormatEditor } from '@/components/editor/MonacoEditor'
import * as yaml from 'js-yaml'

export function YamlConfigPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [messageText, setMessageText] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleFormat = useCallback(() => {
    if (!input.trim()) return
    try {
      const obj = yaml.load(input)
      setOutput(yaml.dump(obj, { indent: 2, lineWidth: -1, noRefs: true }))
      setStatus('success')
      setMessageText('格式化成功')
    } catch (e) {
      setStatus('error')
      setMessageText('YAML 格式错误: ' + (e as Error).message)
    }
  }, [input])

  const handleValidate = useCallback(() => {
    if (!input.trim()) return
    try {
      yaml.load(input)
      setStatus('success')
      setMessageText('YAML 格式有效 ✓')
      setOutput('')
    } catch (e) {
      setStatus('error')
      setMessageText('YAML 格式错误: ' + (e as Error).message)
      setOutput('')
    }
  }, [input])

  return (
    <div className="h-full flex flex-col">
      <PageHeader title="YAML 配置" subtitle="Spring Boot / Docker Compose / K8S YAML 格式化与校验" />
      <div className="flex-1 min-h-0">
        <SplitPanel left={
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Button type="primary" size="small" icon={<FormatPainterOutlined />} onClick={handleFormat}>格式化</Button>
              <Button size="small" icon={<CheckCircleOutlined />} onClick={handleValidate}>校验</Button>
              <Button size="small" icon={<ClearOutlined />} onClick={() => { setInput(''); setOutput(''); setStatus('idle'); setMessageText('') }}>清空</Button>
            </div>
            <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
              <FormatEditor value={input} onChange={setInput} language="yaml" />
            </div>
          </div>
        } right={
          <div className="h-full flex flex-col">
            {status !== 'idle' && (
              <div className={`text-xs px-3 py-1.5 mb-2 rounded ${status === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>{messageText}</div>
            )}
            <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
              {output ? <FormatEditor value={output} language="yaml" readOnly /> : (
                <div className="flex items-center justify-center h-full text-xs" style={{ color: 'var(--ant-color-text-description)' }}>格式化后的配置将在此显示</div>
              )}
            </div>
          </div>
        } />
      </div>
    </div>
  )
}
