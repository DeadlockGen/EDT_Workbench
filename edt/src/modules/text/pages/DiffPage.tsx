import { useState } from 'react'
import { Select, Space, Button } from 'antd'
import { ClearOutlined } from '@ant-design/icons'
import { DiffEditorPanel, FormatEditor } from '@/components/editor/MonacoEditor'

export default function DiffPage() {
  const [original, setOriginal] = useState('')
  const [modified, setModified] = useState('')
  const [language, setLanguage] = useState('plaintext')

  const isDifferent = original !== modified

  return (
    <div className="h-full flex flex-col" style={{ padding: 12 }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium">文本 Diff</span>
        <Space>
          <Select size="small" value={language} onChange={setLanguage} style={{ width: 120 }}
            options={[
              { value: 'plaintext', label: '纯文本' },
              { value: 'json', label: 'JSON' }, { value: 'xml', label: 'XML' },
              { value: 'yaml', label: 'YAML' }, { value: 'sql', label: 'SQL' },
              { value: 'javascript', label: 'JavaScript' }, { value: 'typescript', label: 'TypeScript' },
              { value: 'python', label: 'Python' }, { value: 'java', label: 'Java' }, { value: 'go', label: 'Go' }
            ]} />
          <Button size="small" icon={<ClearOutlined />} onClick={() => { setOriginal(''); setModified('') }}>清空</Button>
        </Space>
      </div>

      {/* Input editors - fixed 40% height */}
      <div className="flex gap-2" style={{ flex: '0 0 40%', minHeight: 100 }}>
        <div className="flex-1 flex flex-col min-w-0">
          <span className="text-xs mb-1" style={{ color: 'var(--ant-color-text-description)' }}>原始文本</span>
          <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
            <FormatEditor value={original} onChange={setOriginal} language={language} />
          </div>
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs" style={{ color: 'var(--ant-color-text-description)' }}>修改后文本</span>
            <span className="text-xs" style={{ color: isDifferent ? 'var(--ant-color-warning)' : 'var(--ant-color-success)' }}>
              {original || modified ? (isDifferent ? '✦ 检测到差异' : '✓ 内容相同') : ''}
            </span>
          </div>
          <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
            <FormatEditor value={modified} onChange={setModified} language={language} />
          </div>
        </div>
      </div>

      {/* Diff panel - takes remaining space */}
      <div className="flex-1 min-h-0 mt-2 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
        <div className="text-xs px-3 py-1 border-b" style={{ borderColor: 'var(--ant-color-border)', color: 'var(--ant-color-text-description)' }}>
          差异对比
        </div>
        <DiffEditorPanel original={original} modified={modified} language={language} />
      </div>
    </div>
  )
}
