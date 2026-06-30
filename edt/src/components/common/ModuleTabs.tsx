import { useMemo } from 'react'
import { Tabs } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'

export interface TabItem {
  key: string
  label: string
  content: React.ReactNode
}

interface ModuleTabsProps {
  module: string
  tabs: TabItem[]
  defaultTab?: string
}

export function ModuleTabs({ module, tabs, defaultTab }: ModuleTabsProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const currentKey = useMemo(() => {
    const hash = location.hash.replace('#', '')
    if (hash && tabs.some((t) => t.key === hash)) return hash
    return defaultTab || tabs[0]?.key
  }, [location.hash, tabs, defaultTab])

  const activeTab = useMemo(() => {
    return tabs.find((t) => t.key === currentKey) || tabs[0]
  }, [currentKey, tabs])

  return (
    <div className="h-full flex flex-col">
      <Tabs
        activeKey={activeTab?.key}
        onChange={(key) => navigate(`${module}#${key}`, { replace: true })}
        type="card"
        size="small"
        className="module-tabs"
        style={{ marginBottom: 0, flexShrink: 0 }}
        items={tabs.map((tab) => ({
          key: tab.key,
          label: tab.label
        }))}
      />
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab?.content}
      </div>
    </div>
  )
}
