import { useState } from 'react'
import { Tabs } from 'antd'
import { ScriptList } from './components/ScriptList'
import { ScriptEditor } from './components/ScriptEditor'
import type { Script } from './stores/script.store'

export default function ScriptsWorkspace() {
  const [editingScript, setEditingScript] = useState<Script | null>(null)
  const [activeKey, setActiveKey] = useState('list')

  const handleEdit = (s: Script) => {
    setEditingScript(s)
    setActiveKey('edit')
  }

  const handleCreateNew = () => {
    setEditingScript(null)
    setActiveKey('new')
  }

  const handleTabChange = (key: string) => {
    setActiveKey(key)
    if (key !== 'edit') setEditingScript(null)
  }

  return (
    <div className="h-full flex flex-col">
      <Tabs
        activeKey={activeKey}
        onChange={handleTabChange}
        type="card"
        size="small"
        className="module-tabs"
        style={{ marginBottom: 0, flexShrink: 0 }}
        items={[
          { key: 'list', label: '脚本列表' },
          { key: 'new', label: '+ 新建脚本' },
          ...(editingScript ? [{ key: 'edit', label: `✎ ${editingScript.name}` }] : []),
        ]}
      />
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeKey === 'list' && <ScriptList onEdit={handleEdit} onCreateNew={handleCreateNew} />}
        {activeKey === 'new' && <ScriptEditor script={null} />}
        {activeKey === 'edit' && editingScript && <ScriptEditor script={editingScript} onSaved={() => setActiveKey('list')} />}
      </div>
    </div>
  )
}
