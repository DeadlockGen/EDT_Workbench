import { ModuleTabs, type TabItem } from '@/components/common/ModuleTabs'
import { SettingsPage, AboutPage } from './pages/SettingsPage'

const tabs: TabItem[] = [
  { key: 'general', label: '通用设置', content: <SettingsPage /> },
  { key: 'about', label: '关于 EDT', content: <AboutPage /> }
]

export default function SettingsWorkspace() {
  return <ModuleTabs module="/settings" tabs={tabs} defaultTab="general" />
}
