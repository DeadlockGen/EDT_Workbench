import { useState, useCallback, useEffect } from 'react'
import { Button, Input, Select, message } from 'antd'
import { SaveOutlined, CopyOutlined } from '@ant-design/icons'
import { FormatEditor } from '@/components/editor/MonacoEditor'
import { useScriptStore, Script } from '../stores/script.store'

interface Props {
  script: Script | null
  onSaved?: () => void
}

const LANGUAGES = [
  { value: 'shell', label: 'Shell' },
  { value: 'powershell', label: 'PowerShell' },
  { value: 'cmd', label: 'CMD' },
  { value: 'sql', label: 'SQL' },
  { value: 'python', label: 'Python' }
]

const TEMPLATES: Record<string, string> = {
  shell: '#!/bin/bash\n\n# Script description\necho "Hello EDT"',
  powershell: '# PowerShell script\nWrite-Host "Hello EDT"',
  cmd: '@echo off\nREM CMD script\necho Hello EDT',
  sql: '-- SQL script\nSELECT * FROM dual;',
  python: '#!/usr/bin/env python3\n# Python script\nprint("Hello EDT")'
}

export function ScriptEditor({ script, onSaved }: Props) {
  const { categories, createScript, updateScript, loadCategories } = useScriptStore()
  const [name, setName] = useState(script?.name || '')
  const [content, setContent] = useState(script?.content || '')
  const [language, setLanguage] = useState(script?.language || 'shell')
  const [description, setDescription] = useState(script?.description || '')
  const [categoryId, setCategoryId] = useState<number | null>(script?.category_id || null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadCategories() }, [])

  const handleSave = useCallback(async () => {
    if (!name.trim()) { message.warning('请输入脚本名称'); return }
    setSaving(true)
    try {
      if (script?.id) {
        await updateScript(script.id, { name, content, language, description, category_id: categoryId })
        message.success('脚本已更新')
      } else {
        await createScript({ name, content, language, description, category_id: categoryId })
        message.success('脚本已创建')
      }
      onSaved?.()
    } catch (e) {
      message.error('保存失败: ' + (e as Error).message)
    }
    setSaving(false)
  }, [name, content, language, description, categoryId, script])

  const handleLanguageChange = useCallback((lang: string) => {
    setLanguage(lang)
    if (!content || content === TEMPLATES[language]) {
      setContent(TEMPLATES[lang] || '')
    }
  }, [content, language])

  const handleCopyContent = useCallback(() => {
    navigator.clipboard.writeText(content)
    message.success('内容已复制')
  }, [content])

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <Input size="small" value={name} onChange={e => setName(e.target.value)} placeholder="脚本名称" className="max-w-xs" />
        <Select size="small" value={language} onChange={handleLanguageChange} style={{ width: 120 }} options={LANGUAGES} />
        <Select size="small" value={categoryId} onChange={setCategoryId} style={{ width: 120 }} allowClear placeholder="分类"
          options={categories.map(c => ({ value: c.id, label: c.name }))} />
        <Input size="small" value={description} onChange={e => setDescription(e.target.value)} placeholder="说明（可选）" className="max-w-sm" />
        <Button type="primary" size="small" icon={<SaveOutlined />} onClick={handleSave} loading={saving}>保存</Button>
        <Button size="small" icon={<CopyOutlined />} onClick={handleCopyContent}>复制</Button>
      </div>
      <div className="flex-1 min-h-0 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
        <FormatEditor value={content} onChange={setContent} language={language} />
      </div>
    </div>
  )
}
