import { useEffect, useState, useCallback } from 'react'
import { Button, Input, Select, Tag, Space, Popconfirm, message, Empty, Spin, Modal, Dropdown } from 'antd'
import { PlusOutlined, DeleteOutlined, StarOutlined, StarFilled, SearchOutlined, DownloadOutlined, UploadOutlined, FileAddOutlined, EditOutlined, DownOutlined } from '@ant-design/icons'
import { useScriptStore } from '../stores/script.store'
import type { Script } from '../stores/script.store'

interface ScriptListProps {
  onEdit: (script: Script) => void
  onCreateNew: () => void
}

const TEMPLATES: Record<string, { name: string; content: string; language: string }[]> = {
  'Shell': [
    { name: '备份脚本', language: 'shell', content: '#!/bin/bash\n# Backup script\nBACKUP_DIR="/backup/$(date +%Y%m%d)"\nmkdir -p "$BACKUP_DIR"\ntar -czf "$BACKUP_DIR/app.tar.gz" /path/to/app\necho "Backup completed: $BACKUP_DIR"' },
    { name: '日志清理', language: 'shell', content: '#!/bin/bash\n# Clean logs older than N days\nDAYS=30\nLOG_DIR="/var/log/app"\nfind "$LOG_DIR" -name "*.log" -mtime +$DAYS -delete\necho "Cleaned logs older than $DAYS days"' },
    { name: '健康检查', language: 'shell', content: '#!/bin/bash\n# Health check\nURL="http://localhost:8080/health"\nSTATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL")\nif [ "$STATUS" == "200" ]; then\n    echo "Service is healthy"\nelse\n    echo "Service is unhealthy (HTTP $STATUS)"\n    exit 1\nfi' }
  ],
  'PowerShell': [
    { name: 'IIS 部署', language: 'powershell', content: '# IIS Deployment\n$siteName = "MyApp"\n$sourcePath = "\\\\server\\build\\app"\n$sitePath = "C:\\inetpub\\wwwroot\\$siteName"\n\nStop-Website -Name $siteName\nCopy-Item "$sourcePath\\*" $sitePath -Recurse -Force\nStart-Website -Name $siteName\nWrite-Host "Deployment completed"' },
    { name: 'AD 用户查询', language: 'powershell', content: '# Query AD users\nGet-ADUser -Filter * -Properties DisplayName, EmailAddress, Department |\nSelect-Object DisplayName, EmailAddress, Department |\nExport-Csv "ad_users.csv" -NoTypeInformation' }
  ],
  'SQL': [
    { name: '表空间查询', language: 'sql', content: '-- Tablespace usage\nSELECT \n    tablespace_name,\n    ROUND(SUM(bytes)/1024/1024, 2) AS total_mb,\n    ROUND(SUM(CASE WHEN free.bytes IS NULL THEN 0 ELSE free.bytes END)/1024/1024, 2) AS free_mb\nFROM dba_data_files\nLEFT JOIN dba_free_space USING (tablespace_name)\nGROUP BY tablespace_name;' },
    { name: '会话监控', language: 'sql', content: '-- Active sessions\nSELECT \n    sid, serial#, username, status,\n    machine, program,\n    ROUND(elapsed_seconds/60, 1) AS elapsed_min\nFROM v$session\nWHERE type != \'BACKGROUND\'\n  AND status = \'ACTIVE\'\nORDER BY elapsed_seconds DESC;' }
  ],
  'Python': [
    { name: '配置文件解析', language: 'python', content: '#!/usr/bin/env python3\nimport configparser\n\nconfig = configparser.ConfigParser()\nconfig.read("config.ini")\n\nfor section in config.sections():\n    print(f"[{section}]")\n    for key, value in config.items(section):\n        print(f"{key} = {value}")' },
    { name: 'CSV 数据处理', language: 'python', content: '#!/usr/bin/env python3\nimport csv\nimport json\n\ndata = []\nwith open("input.csv", "r") as f:\n    reader = csv.DictReader(f)\n    for row in reader:\n        data.append(row)\n\nwith open("output.json", "w") as f:\n    json.dump(data, f, indent=2, ensure_ascii=False)\n\nprint(f"Converted {len(data)} rows")' }
  ]
}

export function ScriptList({ onEdit, onCreateNew }: ScriptListProps) {
  const { scripts, categories, loading, loadScripts, loadCategories, deleteScript, toggleFavorite, createScript, createCategory, deleteCategory } = useScriptStore()
  const [search, setSearch] = useState('')
  const [langFilter, setLangFilter] = useState('')
  const [catFilter, setCatFilter] = useState<number | null>(null)
  const [showFavorites, setShowFavorites] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [templateModal, setTemplateModal] = useState(false)
  const [importModal, setImportModal] = useState(false)
  const [importText, setImportText] = useState('')

  useEffect(() => {
    loadScripts()
    loadCategories()
  }, [])

  const filteredScripts = scripts.filter(s => {
    if (showFavorites && !s.is_favorite) return false
    if (langFilter && s.language !== langFilter) return false
    if (catFilter !== null && s.category_id !== catFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.content.toLowerCase().includes(q)
    }
    return true
  })

  const handleExportAll = useCallback(() => {
    const data = JSON.stringify(scripts, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `edt-scripts-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    message.success(`已导出 ${scripts.length} 个脚本`)
  }, [scripts])

  const handleImport = useCallback(async () => {
    if (!importText.trim()) return
    try {
      const imported = JSON.parse(importText)
      if (!Array.isArray(imported)) throw new Error('格式错误，需要数组')
      let count = 0
      for (const s of imported) {
        if (!s.name || !s.content) continue
        await createScript(s)
        count++
      }
      message.success(`已导入 ${count} 个脚本`)
      setImportModal(false)
      setImportText('')
    } catch (e) {
      message.error('导入失败: ' + (e as Error).message)
    }
  }, [importText, createScript])

  const handleUseTemplate = useCallback(async (t: typeof TEMPLATES['Shell'][0]) => {
    await createScript({ name: t.name, content: t.content, language: t.language })
    message.success(`已从模板创建: ${t.name}`)
    setTemplateModal(false)
  }, [createScript])

  const handleDelete = useCallback(async (id: number, name: string) => {
    await deleteScript(id)
    message.success(`已删除: ${name}`)
  }, [deleteScript])

  const handleAddCategory = useCallback(async () => {
    if (!newCategory.trim()) return
    await createCategory(newCategory.trim())
    setNewCategory('')
    message.success('分类已创建')
  }, [newCategory, createCategory])

  const handleDeleteCategory = useCallback(async (id: number, name: string) => {
    await deleteCategory(id)
    message.success(`分类已删除: ${name}`)
  }, [deleteCategory])

  const handleDownload = useCallback((s: Script) => {
    const extMap: Record<string, string> = { shell: 'sh', powershell: 'ps1', cmd: 'cmd', sql: 'sql', python: 'py' }
    const ext = extMap[s.language] || 'txt'
    const blob = new Blob([s.content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${s.name}.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const languages = ['shell', 'powershell', 'cmd', 'sql', 'python']

  return (
    <div className="h-full flex flex-col gap-3 overflow-hidden" style={{ padding: 12 }}>
      <div className="flex items-center gap-2 flex-wrap">
        <Input size="small" prefix={<SearchOutlined />} placeholder="搜索脚本..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" allowClear />
        <Select size="small" value={langFilter} onChange={setLangFilter} style={{ width: 100 }} allowClear placeholder="语言"
          options={[{ value: '', label: '全部' }, ...languages.map(l => ({ value: l, label: l }))]} />
        <Select size="small" value={catFilter} onChange={setCatFilter} style={{ width: 110 }} allowClear placeholder="分类"
          options={[{ value: null, label: '全部' } as any, ...categories.map(c => ({ value: c.id, label: c.name }))]} />
        <Tag color={showFavorites ? 'gold' : 'default'} className="cursor-pointer" onClick={() => setShowFavorites(!showFavorites)}>
          {showFavorites ? '★ 仅收藏' : '☆ 全部'}
        </Tag>
      </div>

      <div className="flex items-center gap-2">
        <Input size="small" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="新分类名称" className="max-w-xs" onPressEnter={handleAddCategory} />
        <Button size="small" icon={<PlusOutlined />} onClick={handleAddCategory}>添加分类</Button>
        {categories.length > 0 && (
          <Dropdown
            trigger={['click']}
            menu={{
              items: categories.map(c => ({
                key: c.id,
                label: (
                  <div className="flex items-center justify-between gap-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, width: 180 }}>
                    <span>{c.name}</span>
                    <DeleteOutlined style={{ fontSize: 12, color: '#999', cursor: 'pointer' }}
                      onClick={e => {
                        e.stopPropagation()
                        Modal.confirm({
                          title: `删除分类"${c.name}"?`,
                          content: '该分类下的脚本分类将被清空',
                          onOk: () => handleDeleteCategory(c.id, c.name),
                        })
                      }} />
                  </div>
                ),
              })),
            }}
          >
            <Button size="small">管理分类 <DownOutlined /></Button>
          </Dropdown>
        )}
        <div className="flex-1" />
        <Button size="small" icon={<FileAddOutlined />} onClick={() => setTemplateModal(true)}>模板</Button>
        <Button size="small" icon={<UploadOutlined />} onClick={() => setImportModal(true)}>导入</Button>
        <Button size="small" icon={<DownloadOutlined />} onClick={handleExportAll}>导出全部</Button>
      </div>

      {loading ? <Spin className="self-center mt-8" /> : filteredScripts.length === 0 ? (
        <Empty description="暂无脚本，可从模板创建或导入" />
      ) : (
        <div className="flex-1 overflow-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--ant-color-border-secondary)' }}>
                <th className="text-left py-2 px-1 w-8"></th>
                <th className="text-left py-2 px-1">名称</th>
                <th className="text-left py-2 px-1 w-16">语言</th>
                <th className="text-left py-2 px-1 w-16">分类</th>
                <th className="text-left py-2 px-1">说明</th>
                <th className="text-right py-2 px-1 w-24">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredScripts.map(s => (
                <tr key={s.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50" style={{ borderColor: 'var(--ant-color-border-secondary)' }}>
                  <td className="py-1.5 px-1">
                    <span className="cursor-pointer" onClick={() => toggleFavorite(s.id!)}>
                      {s.is_favorite ? <StarFilled className="text-yellow-500" /> : <StarOutlined className="text-gray-300" />}
                    </span>
                  </td>
                  <td className="py-1.5 px-1 font-medium">{s.name}</td>
                  <td className="py-1.5 px-1"><Tag className="text-2xs">{s.language}</Tag></td>
                  <td className="py-1.5 px-1 text-xs" style={{ color: 'var(--ant-color-text-description)' }}>{categories.find(c => c.id === s.category_id)?.name || '-'}</td>
                  <td className="py-1.5 px-1 text-xs max-w-[200px] truncate" style={{ color: 'var(--ant-color-text-description)' }}>{s.description || '-'}</td>
                  <td className="py-1.5 px-1 text-right">
                    <Space size="small">
                      <Button size="small" type="link" icon={<EditOutlined />} onClick={() => onEdit(s)}>编辑</Button>
                      <Button size="small" type="link" icon={<DownloadOutlined />} onClick={() => handleDownload(s)}>下载</Button>
                      <Popconfirm title="确认删除?" onConfirm={() => handleDelete(s.id!, s.name)}>
                        <DeleteOutlined className="text-gray-400 hover:text-red-500 cursor-pointer" />
                      </Popconfirm>
                    </Space>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Template Modal */}
      <Modal title="从模板创建" open={templateModal} onCancel={() => setTemplateModal(false)} footer={null} width={600}>
        <div className="flex flex-col gap-3 max-h-96 overflow-auto">
          {Object.entries(TEMPLATES).map(([group, items]) => (
            <div key={group}>
              <div className="text-xs font-medium mb-1">{group}</div>
              <div className="grid grid-cols-2 gap-2">
                {items.map(t => (
                  <Button key={t.name} size="small" className="text-left h-auto py-2" onClick={() => handleUseTemplate(t)}>
                    <div className="text-xs">{t.name}</div>
                    <div className="text-2xs" style={{ color: 'var(--ant-color-text-description)' }}>{t.language}</div>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Import Modal */}
      <Modal title="导入脚本" open={importModal} onCancel={() => setImportModal(false)} onOk={handleImport} okText="导入" width={500}>
        <div className="flex flex-col gap-2">
          <span className="text-xs">粘贴 JSON 格式的脚本数据：</span>
          <textarea className="w-full h-48 border rounded text-xs p-2 font-mono" value={importText} onChange={e => setImportText(e.target.value)}
            style={{ borderColor: 'var(--ant-color-border)', backgroundColor: 'var(--ant-color-bg-layout)' }} />
          <span className="text-2xs" style={{ color: 'var(--ant-color-text-description)' }}>
            {'格式: [{name: "脚本名", content: "...", language: "shell"}]'}
          </span>
        </div>
      </Modal>
    </div>
  )
}
