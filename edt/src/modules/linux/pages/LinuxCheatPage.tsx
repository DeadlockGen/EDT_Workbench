import { PageHeader } from '@/components/common/PageHeader'
import { ToolCard } from '@/components/common/ToolCard'
import { SearchOutlined, AppstoreOutlined } from '@ant-design/icons'

const categories = [
  { title: 'Systemctl', path: '/linux?cat=systemctl', icon: <AppstoreOutlined /> },
  { title: 'Journalctl', path: '/linux?cat=journalctl', icon: <SearchOutlined /> },
  { title: 'Nginx', path: '/linux?cat=nginx', icon: <AppstoreOutlined /> },
  { title: 'Docker', path: '/linux?cat=docker', icon: <AppstoreOutlined /> },
  { title: 'Kubernetes', path: '/linux?cat=kubernetes', icon: <AppstoreOutlined /> },
  { title: 'Redis', path: '/linux?cat=redis', icon: <AppstoreOutlined /> },
  { title: 'MySQL', path: '/linux?cat=mysql', icon: <AppstoreOutlined /> },
  { title: 'Oracle', path: '/linux?cat=oracle', icon: <AppstoreOutlined /> },
  { title: 'PostgreSQL', path: '/linux?cat=postgresql', icon: <AppstoreOutlined /> },
  { title: 'Kafka', path: '/linux?cat=kafka', icon: <AppstoreOutlined /> },
  { title: 'RabbitMQ', path: '/linux?cat=rabbitmq', icon: <AppstoreOutlined /> }
]

export default function LinuxCheatPage() {
  return (
    <div>
      <PageHeader title="Linux 辅助" subtitle="常用命令速查 · 分类搜索 · 一键复制" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {categories.map((cat) => (
          <ToolCard key={cat.path} {...cat} />
        ))}
      </div>
    </div>
  )
}
