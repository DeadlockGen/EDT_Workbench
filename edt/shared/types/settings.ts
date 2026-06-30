export interface AppSettings {
  theme: 'light' | 'dark'
  sidebarCollapsed: boolean
  fontSize: number
  tabSize: number
  wordWrap: 'on' | 'off'
  minimap: boolean
  lineNumbers: 'on' | 'off'
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  sidebarCollapsed: false,
  fontSize: 14,
  tabSize: 2,
  wordWrap: 'on',
  minimap: true,
  lineNumbers: 'on'
}
