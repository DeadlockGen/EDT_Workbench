import { ModuleTabs, type TabItem } from '@/components/common/ModuleTabs'
import { DockerComposeValidate, DockerfileViewer, YamlLintPage } from './pages/DockerPage'

const tabs: TabItem[] = [
  { key: 'compose', label: 'Compose 校验', content: <DockerComposeValidate /> },
  { key: 'dockerfile', label: 'Dockerfile', content: <DockerfileViewer /> },
  { key: 'yaml-lint', label: 'YAML 校验', content: <YamlLintPage /> }
]

export default function DockerWorkspace() {
  return <ModuleTabs module="/docker" tabs={tabs} defaultTab="compose" />
}
