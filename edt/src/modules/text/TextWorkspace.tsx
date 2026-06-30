import { ModuleTabs, type TabItem } from '@/components/common/ModuleTabs'
import JsonPage from './pages/JsonPage'
import XmlPage from './pages/XmlPage'
import YamlPage from './pages/YamlPage'
import SqlPage from './pages/SqlPage'
import IniPage from './pages/IniPage'
import PropertiesPage from './pages/PropertiesPage'
import DiffPage from './pages/DiffPage'
import ConvertPage from './pages/ConvertPage'

const tabs: TabItem[] = [
  { key: 'json', label: 'JSON', content: <JsonPage /> },
  { key: 'xml', label: 'XML', content: <XmlPage /> },
  { key: 'yaml', label: 'YAML', content: <YamlPage /> },
  { key: 'sql', label: 'SQL', content: <SqlPage /> },
  { key: 'ini', label: 'INI', content: <IniPage /> },
  { key: 'properties', label: 'Properties', content: <PropertiesPage /> },
  { key: 'diff', label: 'Diff', content: <DiffPage /> },
  { key: 'convert', label: '互转', content: <ConvertPage /> }
]

export default function TextWorkspace() {
  return <ModuleTabs module="/text" tabs={tabs} defaultTab="json" />
}
