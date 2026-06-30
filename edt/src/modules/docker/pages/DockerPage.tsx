import { useState, useCallback } from 'react'
import { Button } from 'antd'
import { CheckCircleOutlined, FormatPainterOutlined, ClearOutlined } from '@ant-design/icons'
import { SplitPanel } from '@/components/layout/SplitPanel'
import { FormatEditor } from '@/components/editor/MonacoEditor'
import * as yaml from 'js-yaml'

// Docker Compose Validate
export function DockerComposeValidate() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [messageText, setMessageText] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleValidate = useCallback(() => {
    if (!input.trim()) return
    try {
      const doc = yaml.load(input) as any
      if (!doc || typeof doc !== 'object') throw new Error('YAML 内容为空')
      if (doc.services && typeof doc.services === 'object') {
        const svcs = Object.keys(doc.services)
        setStatus('success')
        setMessageText(`Compose 格式有效 ✓ 服务列表: ${svcs.join(', ')}`)
        setOutput('')
      } else {
        throw new Error('缺少 services 字段')
      }
    } catch (e) {
      setStatus('error')
      setMessageText('校验失败: ' + (e as Error).message)
      setOutput('')
    }
  }, [input])

  const handleFormat = useCallback(() => {
    if (!input.trim()) return
    try {
      const obj = yaml.load(input)
      setOutput(yaml.dump(obj, { indent: 2, lineWidth: -1, noRefs: true }))
      setStatus('success')
      setMessageText('格式化成功')
    } catch (e) {
      setStatus('error')
      setMessageText('格式化失败: ' + (e as Error).message)
    }
  }, [input])

  return (
    <div className="h-full flex flex-col" style={{ padding: 12 }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium">Docker Compose 校验与格式化</span>
        <Button size="small" icon={<ClearOutlined />} onClick={() => { setInput(''); setOutput(''); setStatus('idle'); setMessageText('') }}>清空</Button>
      </div>
      <div className="flex-1 min-h-0">
        <SplitPanel left={
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Button type="primary" size="small" icon={<CheckCircleOutlined />} onClick={handleValidate}>校验</Button>
              <Button size="small" icon={<FormatPainterOutlined />} onClick={handleFormat}>格式化</Button>
            </div>
            <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
              <FormatEditor value={input} onChange={setInput} language="yaml" />
            </div>
          </div>
        } right={
          <div className="h-full flex flex-col">
            {status !== 'idle' && (
              <div className={`text-xs px-3 py-1.5 mb-2 rounded whitespace-pre-wrap ${
                status === 'success'
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>{messageText}</div>
            )}
            <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
              {output ? <FormatEditor value={output} language="yaml" readOnly /> : (
                <div className="flex items-center justify-center h-full text-xs" style={{ color: 'var(--ant-color-text-description)' }}>结果将在此显示</div>
              )}
            </div>
          </div>
        } />
      </div>
    </div>
  )
}

// Dockerfile Viewer
export function DockerfileViewer() {
  const [input, setInput] = useState('')
  const tips = 'Dockerfile 基本指令:\nFROM - 基础镜像\nRUN - 执行命令\nCOPY - 复制文件\nADD - 复制或解压\nWORKDIR - 工作目录\nCMD - 默认命令\nENTRYPOINT - 入口点\nEXPOSE - 暴露端口\nENV - 环境变量\nARG - 构建参数\nLABEL - 元数据'

  return (
    <div className="h-full flex flex-col" style={{ padding: 12 }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium">Dockerfile 查看</span>
        <span className="text-xs" style={{ color: 'var(--ant-color-text-description)' }}>Dockerfile 语法高亮</span>
      </div>
      <div className="flex-1 flex gap-3 min-h-0">
        <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
          <FormatEditor value={input} onChange={setInput} language="dockerfile" />
        </div>
        <div className="w-60 p-3 rounded text-xs leading-relaxed border flex-shrink-0" style={{ borderColor: 'var(--ant-color-border)', color: 'var(--ant-color-text-secondary)', backgroundColor: 'var(--ant-color-bg-layout)' }}>
          <div className="font-medium mb-2">Dockerfile 指令参考</div>
          <div className="whitespace-pre-wrap">{tips}</div>
        </div>
      </div>
    </div>
  )
}

// YAML Lint
export function YamlLintPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleLint = useCallback(() => {
    if (!input.trim()) return
    setMessage('')
    try {
      const parsed = yaml.load(input)
      if (parsed === null || parsed === undefined) {
        setMessage('YAML 内容为空')
        setStatus('error')
        setOutput('')
        return
      }
      setOutput(yaml.dump(parsed, { indent: 2, lineWidth: -1, noRefs: true }))
      setStatus('success')
      setMessage('YAML 格式有效 ✓')
    } catch (e) {
      const errMsg = (e as Error).message
      setMessage('YAML 解析错误: ' + errMsg)
      setStatus('error')
      setOutput('')
    }
  }, [input])

  const handleFormat = useCallback(() => {
    if (!input.trim()) return
    try {
      const parsed = yaml.load(input)
      if (parsed === null || parsed === undefined) {
        setMessage('YAML 内容为空')
        setStatus('error')
        return
      }
      setOutput(yaml.dump(parsed, { indent: 2, lineWidth: -1, noRefs: true }))
      setStatus('success')
      setMessage('格式化成功')
    } catch (e) {
      setMessage('YAML 格式错误: ' + (e as Error).message)
      setStatus('error')
      setOutput('')
    }
  }, [input])

  return (
    <div className="h-full flex flex-col" style={{ padding: 12 }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium">YAML 校验</span>
        <Button size="small" icon={<ClearOutlined />} onClick={() => { setInput(''); setOutput(''); setMessage(''); setStatus('idle') }}>清空</Button>
      </div>
      <div className="flex-1 min-h-0">
        <SplitPanel left={
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Button type="primary" size="small" icon={<CheckCircleOutlined />} onClick={handleLint}>校验</Button>
              <Button size="small" icon={<FormatPainterOutlined />} onClick={handleFormat}>格式化</Button>
            </div>
            <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
              <FormatEditor value={input} onChange={setInput} language="yaml" />
            </div>
          </div>
        } right={
          <div className="h-full flex flex-col">
            {status !== 'idle' && (
              <div className={`text-xs px-3 py-1.5 mb-2 rounded whitespace-pre-wrap ${
                status === 'success'
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>{message}</div>
            )}
            <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
              {output ? <FormatEditor value={output} language="yaml" readOnly /> : (
                <div className="flex items-center justify-center h-full text-xs" style={{ color: 'var(--ant-color-text-description)' }}>校验结果将在此显示</div>
              )}
            </div>
          </div>
        } />
      </div>
    </div>
  )
}
