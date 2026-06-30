import { ModuleTabs, type TabItem } from '@/components/common/ModuleTabs'
import { TtlConverter, RedisCommands, DataStructures } from './pages/RedisToolsPage'

const tabs: TabItem[] = [
  { key: 'ttl', label: 'TTL 转换', content: <TtlConverter /> },
  { key: 'commands', label: '常用命令', content: <RedisCommands /> },
  { key: 'datastructures', label: '数据结构', content: <DataStructures /> }
]

export default function RedisWorkspace() {
  return <ModuleTabs module="/redis" tabs={tabs} defaultTab="ttl" />
}
