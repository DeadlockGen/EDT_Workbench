import { PageHeader } from '@/components/common/PageHeader'
import { ToolCard } from '@/components/common/ToolCard'
import {
  SwapOutlined,
  CodeOutlined,
  FileTextOutlined,
  ColumnWidthOutlined,
  CheckSquareOutlined
} from '@ant-design/icons'

const tools = [
  { title: 'CSV ↔ Excel', path: '/excel/csv', icon: <SwapOutlined /> },
  { title: 'Excel → JSON', path: '/excel/to-json', icon: <CodeOutlined /> },
  { title: 'Excel → SQL', path: '/excel/to-sql', icon: <FileTextOutlined /> },
  { title: 'Excel → Markdown', path: '/excel/to-markdown', icon: <FileTextOutlined /> },
  { title: 'Excel → HTML', path: '/excel/to-html', icon: <CodeOutlined /> },
  { title: 'Sheet 比较', path: '/excel/sheet-compare', icon: <ColumnWidthOutlined /> },
  { title: '列比较', path: '/excel/column-compare', icon: <ColumnWidthOutlined /> },
  { title: '字段校验', path: '/excel/validate', icon: <CheckSquareOutlined /> }
]

export default function ExcelToolsPage() {
  return (
    <div>
      <PageHeader title="Excel 工具" subtitle="CSV / Excel 互转 · JSON / SQL / Markdown / HTML 转换 · 比较 · 校验" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {tools.map((tool) => (
          <ToolCard key={tool.path} {...tool} />
        ))}
      </div>
    </div>
  )
}
