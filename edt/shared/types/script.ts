export interface Script {
  id: number
  name: string
  content: string
  language: ScriptLanguage
  category_id: number | null
  is_favorite: number
  description: string
  created_at: string
  updated_at: string
}

export type ScriptLanguage = 'shell' | 'powershell' | 'cmd' | 'sql' | 'python'

export interface ScriptCategory {
  id: number
  name: string
  parent_id: number | null
  sort_order: number
  created_at: string
}
