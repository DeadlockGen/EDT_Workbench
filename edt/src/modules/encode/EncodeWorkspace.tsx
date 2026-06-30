import { ModuleTabs, type TabItem } from '@/components/common/ModuleTabs'
import Base64Page from './pages/Base64Page'
import UrlPage from './pages/UrlPage'
import UnicodePage from './pages/UnicodePage'
import HtmlPage from './pages/HtmlPage'
import HexPage from './pages/HexPage'
import HashPage from './pages/HashPage'
import HmacPage from './pages/HmacPage'
import UuidPage from './pages/UuidPage'
import NanoIdPage from './pages/NanoIdPage'
import JwtPage from './pages/JwtPage'

const tabs: TabItem[] = [
  { key: 'base64', label: 'Base64', content: <Base64Page /> },
  { key: 'url', label: 'URL', content: <UrlPage /> },
  { key: 'unicode', label: 'Unicode', content: <UnicodePage /> },
  { key: 'html', label: 'HTML', content: <HtmlPage /> },
  { key: 'hex', label: 'Hex', content: <HexPage /> },
  { key: 'hash', label: 'Hash', content: <HashPage /> },
  { key: 'hmac', label: 'HMAC', content: <HmacPage /> },
  { key: 'uuid', label: 'UUID', content: <UuidPage /> },
  { key: 'nanoid', label: 'NanoID', content: <NanoIdPage /> },
  { key: 'jwt', label: 'JWT', content: <JwtPage /> }
]

export default function EncodeWorkspace() {
  return <ModuleTabs module="/encode" tabs={tabs} defaultTab="base64" />
}
