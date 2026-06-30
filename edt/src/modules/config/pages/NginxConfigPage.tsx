import { useState, useCallback } from 'react'
import { Button, Space, message } from 'antd'
import { FormatPainterOutlined, CheckCircleOutlined, ClearOutlined } from '@ant-design/icons'
import { PageHeader } from '@/components/common/PageHeader'
import { SplitPanel } from '@/components/layout/SplitPanel'
import { FormatEditor } from '@/components/editor/MonacoEditor'

const nginxTemplates: Record<string, string> = {
  'basic': `server {
    listen 80;
    server_name example.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}`,
  'ssl': `server {
    listen 443 ssl;
    server_name example.com;
    ssl_certificate /etc/ssl/certs/example.com.crt;
    ssl_certificate_key /etc/ssl/private/example.com.key;
    location / {
        root /var/www/html;
        index index.html;
    }
}`,
  'reverse-proxy': `upstream backend {
    server 192.168.1.10:8080 weight=3;
    server 192.168.1.11:8080 weight=2;
    server 192.168.1.12:8080 backup;
}
server {
    listen 80;
    location /api/ {
        proxy_pass http://backend;
    }
}`
}

export function NginxConfigPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [messageText, setMessageText] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleFormat = useCallback(() => {
    if (!input.trim()) return
    const lines = input.split('\n')
    const formatted = lines.map(l => l.trimEnd()).join('\n')
    setOutput(formatted)
    setStatus('success')
    setMessageText('格式化完成')
  }, [input])

  const handleValidate = useCallback(() => {
    if (!input.trim()) {
      message.warning('请输入 Nginx 配置')
      return
    }
    // Basic structural check
    const content = input.trim()
    if (!content.includes('server ') && !content.includes('http ') && !content.includes('events ')) {
      setStatus('error')
      setMessageText('配置无效：缺少 server/http/events 块')
    } else {
      setStatus('success')
      setMessageText('配置结构检查通过 ✓')
    }
  }, [input])

  return (
    <div className="h-full flex flex-col">
      <PageHeader title="Nginx 配置" subtitle="Nginx 配置文件语法高亮、格式化与校验" extra={
        <Space>
          {Object.entries(nginxTemplates).map(([key, val]) => (
            <Button key={key} size="small" onClick={() => setInput(val)}>{key === 'basic' ? '基础模板' : key === 'ssl' ? 'SSL 模板' : '反向代理'}</Button>
          ))}
        </Space>
      } />
      <div className="flex-1 min-h-0">
        <SplitPanel
          left={
            <div className="h-full flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Button type="primary" size="small" icon={<FormatPainterOutlined />} onClick={handleFormat}>格式化</Button>
                <Button size="small" icon={<CheckCircleOutlined />} onClick={handleValidate}>校验</Button>
                <Button size="small" icon={<ClearOutlined />} onClick={() => { setInput(''); setOutput(''); setStatus('idle'); setMessageText('') }}>清空</Button>
              </div>
              <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
                <FormatEditor value={input} onChange={setInput} language="nginx" />
              </div>
            </div>
          }
          right={
            <div className="h-full flex flex-col">
              {status !== 'idle' && (
                <div className={`text-xs px-3 py-1.5 mb-2 rounded ${status === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>{messageText}</div>
              )}
              <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
                {output ? <FormatEditor value={output} language="nginx" readOnly /> : (
                  <div className="flex items-center justify-center h-full text-xs" style={{ color: 'var(--ant-color-text-description)' }}>格式化后的配置将在此显示</div>
                )}
              </div>
            </div>
          }
        />
      </div>
    </div>
  )
}
