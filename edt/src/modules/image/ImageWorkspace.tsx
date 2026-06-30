import { ModuleTabs, type TabItem } from '@/components/common/ModuleTabs'
import { ImageCompress } from './pages/ImageCompress'
import { ImageToBase64 } from './pages/ImageToBase64'
import { SvgViewer } from './pages/SvgViewer'
import { QrCodeGen } from './pages/QrCodeGen'
import { IcoGenerator } from './pages/IcoGenerator'

const tabs: TabItem[] = [
  { key: 'compress', label: '图片压缩', content: <ImageCompress /> },
  { key: 'base64', label: 'Base64 转换', content: <ImageToBase64 /> },
  { key: 'svg', label: 'SVG 查看', content: <SvgViewer /> },
  { key: 'qrgen', label: '二维码生成', content: <QrCodeGen /> },
  { key: 'ico', label: 'ICO 生成', content: <IcoGenerator /> }
]

export default function ImageWorkspace() {
  return <ModuleTabs module="/image" tabs={tabs} defaultTab="compress" />
}
