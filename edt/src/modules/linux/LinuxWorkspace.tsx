import { ModuleTabs, type TabItem } from '@/components/common/ModuleTabs'
import { LinuxCheatPage } from './LinuxCheatPage'

const tabs: TabItem[] = [
  { key: 'systemctl', label: 'Systemctl', content: <LinuxCheatPage category="systemctl" /> },
  { key: 'journalctl', label: 'Journalctl', content: <LinuxCheatPage category="journalctl" /> },
  { key: 'nginx', label: 'Nginx', content: <LinuxCheatPage category="nginx" /> },
  { key: 'docker', label: 'Docker', content: <LinuxCheatPage category="docker" /> },
  { key: 'kubernetes', label: 'Kubernetes', content: <LinuxCheatPage category="kubernetes" /> },
  { key: 'redis', label: 'Redis', content: <LinuxCheatPage category="redis" /> },
  { key: 'mysql', label: 'MySQL', content: <LinuxCheatPage category="mysql" /> },
  { key: 'oracle', label: 'Oracle', content: <LinuxCheatPage category="oracle" /> },
  { key: 'postgresql', label: 'PostgreSQL', content: <LinuxCheatPage category="postgresql" /> },
  { key: 'kafka', label: 'Kafka', content: <LinuxCheatPage category="kafka" /> },
  { key: 'rabbitmq', label: 'RabbitMQ', content: <LinuxCheatPage category="rabbitmq" /> }
]

export default function LinuxWorkspace() {
  return <ModuleTabs module="/linux" tabs={tabs} defaultTab="systemctl" />
}
