import { ModuleTabs, type TabItem } from '@/components/common/ModuleTabs'
import { NginxConfigPage } from './pages/NginxConfigPage'
import { YamlConfigPage } from './pages/YamlConfigPage'
import { PropsConfigPage } from './pages/PropsConfigPage'
import { XmlConfigPage } from './pages/XmlConfigPage'
import { EnvConfigPage } from './pages/EnvConfigPage'

const tabs: TabItem[] = [
  { key: 'nginx', label: 'Nginx', content: <NginxConfigPage /> },
  { key: 'yaml', label: 'YAML', content: <YamlConfigPage /> },
  { key: 'properties', label: 'Properties', content: <PropsConfigPage /> },
  { key: 'xml', label: 'XML/Tomcat', content: <XmlConfigPage /> },
  { key: 'env', label: '.env', content: <EnvConfigPage /> }
]

export default function ConfigWorkspace() {
  return <ModuleTabs module="/config-files" tabs={tabs} defaultTab="nginx" />
}
