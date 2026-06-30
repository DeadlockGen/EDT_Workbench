import { PageHeader } from '@/components/common/PageHeader'

const configTypes = [
  { title: 'Nginx', description: 'nginx.conf 语法高亮 · 格式化 · 校验 · Diff' },
  { title: 'application.yml', description: 'Spring Boot 配置语法高亮 · 格式化 · 校验' },
  { title: 'application.properties', description: 'Properties 格式语法高亮 · 格式化 · 校验' },
  { title: 'Docker Compose', description: 'docker-compose.yml 语法高亮 · 格式化 · 校验' },
  { title: 'Kubernetes YAML', description: 'K8S 资源定义语法高亮 · 格式化 · 校验' },
  { title: 'Redis.conf', description: 'Redis 配置语法高亮 · 格式化 · 校验' },
  { title: 'Tomcat server.xml', description: 'Tomcat 配置语法高亮 · 格式化 · 校验' },
  { title: 'MySQL my.cnf', description: 'MySQL 配置语法高亮 · 格式化 · 校验' },
  { title: '.env 文件', description: '环境变量文件语法高亮 · 格式化 · 校验' }
]

import { ToolCard } from '@/components/common/ToolCard'

export default function ConfigFilePage() {
  return (
    <div>
      <PageHeader title="配置文件工具" subtitle="Nginx / Spring / K8S / Redis / MySQL 等配置文件的格式化与校验" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {configTypes.map((cfg) => (
          <ToolCard key={cfg.title} title={cfg.title} description={cfg.description} />
        ))}
      </div>
    </div>
  )
}
