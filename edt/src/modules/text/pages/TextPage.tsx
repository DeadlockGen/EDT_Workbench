import { PageHeader } from '@/components/common/PageHeader'
import { ToolCard } from '@/components/common/ToolCard'
import {
  FileTextOutlined,
  CodeSandboxOutlined,
  ApartmentOutlined,
  TagsOutlined,
  ColumnWidthOutlined,
  SwapOutlined
} from '@ant-design/icons'

const tools = [
  { title: 'JSON 格式化/校验', path: '/text/json', icon: <CodeSandboxOutlined /> },
  { title: 'XML 格式化/校验', path: '/text/xml', icon: <CodeSandboxOutlined /> },
  { title: 'YAML 格式化/校验', path: '/text/yaml', icon: <FileTextOutlined /> },
  { title: 'SQL 格式化/美化', path: '/text/sql', icon: <ApartmentOutlined /> },
  { title: 'INI 格式化', path: '/text/ini', icon: <TagsOutlined /> },
  { title: 'Properties 格式化', path: '/text/properties', icon: <TagsOutlined /> },
  { title: '文本 Diff', path: '/text/diff', icon: <ColumnWidthOutlined /> },
  { title: '格式互转', path: '/text/convert', icon: <SwapOutlined /> }
]

export default function TextPage() {
  return (
    <div>
      <PageHeader title="文本处理" subtitle="JSON / XML / YAML / SQL / INI / Properties 格式化、校验与互转" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {tools.map((tool) => (
          <ToolCard key={tool.path} {...tool} />
        ))}
      </div>
    </div>
  )
}
