import { ReactNode } from 'react'
import { TextWorkspace } from '../modules/text'
import { EncodeWorkspace } from '../modules/encode'
import { LinuxWorkspace } from '../modules/linux'
import { ConfigWorkspace } from '../modules/config'
import { DockerWorkspace } from '../modules/docker'
import { RedisWorkspace } from '../modules/redis'
import { ImageWorkspace } from '../modules/image'
import { ExcelWorkspace } from '../modules/excel'
import { WordWorkspace } from '../modules/word'
import { ScriptsWorkspace } from '../modules/scripts'
import { SettingsWorkspace } from '../modules/settings'

export interface RouteConfig {
  path: string
  element: ReactNode
}

export const moduleRoutes: RouteConfig[] = [
  { path: 'text', element: <TextWorkspace /> },
  { path: 'encode', element: <EncodeWorkspace /> },
  { path: 'linux', element: <LinuxWorkspace /> },
  { path: 'config-files', element: <ConfigWorkspace /> },
  { path: 'docker', element: <DockerWorkspace /> },
  { path: 'redis', element: <RedisWorkspace /> },
  { path: 'image', element: <ImageWorkspace /> },
  { path: 'excel', element: <ExcelWorkspace /> },
  { path: 'word', element: <WordWorkspace /> },
  { path: 'scripts', element: <ScriptsWorkspace /> },
  { path: 'settings', element: <SettingsWorkspace /> }
]
