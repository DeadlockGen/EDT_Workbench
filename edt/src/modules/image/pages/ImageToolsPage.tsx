import { PageHeader } from '@/components/common/PageHeader'
import { ToolCard } from '@/components/common/ToolCard'
import {
  CompressOutlined,
  PictureOutlined,
  FileImageOutlined,
  QrcodeOutlined,
  ScanOutlined,
  CameraOutlined,
  EyeOutlined
} from '@ant-design/icons'

const tools = [
  { title: '图片压缩', path: '/image/compress', icon: <CompressOutlined /> },
  { title: 'Base64 图片转换', path: '/image/base64', icon: <PictureOutlined /> },
  { title: 'SVG 查看', path: '/image/svg', icon: <EyeOutlined /> },
  { title: 'ICO 生成', path: '/image/ico', icon: <FileImageOutlined /> },
  { title: '二维码生成', path: '/image/qrgen', icon: <QrcodeOutlined /> },
  { title: '二维码解析', path: '/image/qrdecode', icon: <ScanOutlined /> },
  { title: '截图', path: '/image/screenshot', icon: <CameraOutlined /> }
]

export default function ImageToolsPage() {
  return (
    <div>
      <PageHeader title="图片工具" subtitle="压缩 · Base64 · SVG · ICO · 二维码 · 截图 · OCR" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {tools.map((tool) => (
          <ToolCard key={tool.path} {...tool} />
        ))}
      </div>
    </div>
  )
}
