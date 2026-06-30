import { PageHeader } from '@/components/common/PageHeader'
import { ToolCard } from '@/components/common/ToolCard'
import {
  LockOutlined,
  LinkOutlined,
  FontSizeOutlined,
  Html5Outlined,
  NumberOutlined,
  KeyOutlined,
  SafetyOutlined,
  SketchOutlined,
  BarcodeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons'

const tools = [
  { title: 'Base64 编解码', path: '/encode/base64', icon: <LockOutlined /> },
  { title: 'URL 编解码', path: '/encode/url', icon: <LinkOutlined /> },
  { title: 'Unicode 编解码', path: '/encode/unicode', icon: <FontSizeOutlined /> },
  { title: 'HTML 编解码', path: '/encode/html', icon: <Html5Outlined /> },
  { title: 'Hex 转换', path: '/encode/hex', icon: <NumberOutlined /> },
  { title: 'Hash (MD5/SHA)', path: '/encode/hash', icon: <KeyOutlined /> },
  { title: 'HMAC', path: '/encode/hmac', icon: <SafetyOutlined /> },
  { title: 'UUID 生成', path: '/encode/uuid', icon: <BarcodeOutlined /> },
  { title: 'NanoID 生成', path: '/encode/nanoid', icon: <SketchOutlined /> },
  { title: 'JWT 解析', path: '/encode/jwt', icon: <EyeInvisibleOutlined /> }
]

export default function EncodePage() {
  return (
    <div>
      <PageHeader title="编码工具" subtitle="Base64 / URL / Unicode / HTML / Hex / Hash / UUID / JWT" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {tools.map((tool) => (
          <ToolCard key={tool.path} {...tool} />
        ))}
      </div>
    </div>
  )
}
