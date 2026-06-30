import { create } from 'zustand'
import { getDb } from '@/services/db'

export interface Script {
  id: number | null
  name: string
  content: string
  language: string
  category_id: number | null
  is_favorite: number
  description: string
  created_at?: string
  updated_at?: string
}

export interface ScriptCategory {
  id: number
  name: string
  parent_id: number | null
  sort_order: number
}

interface ScriptStore {
  scripts: Script[]
  categories: ScriptCategory[]
  loading: boolean
  loadScripts: () => Promise<void>
  loadCategories: () => Promise<void>
  createScript: (s: Partial<Script>) => Promise<Script>
  updateScript: (id: number, s: Partial<Script>) => Promise<void>
  deleteScript: (id: number) => Promise<void>
  toggleFavorite: (id: number) => Promise<void>
  createCategory: (name: string) => Promise<void>
  deleteCategory: (id: number) => Promise<void>
}

export const useScriptStore = create<ScriptStore>()((set, get) => ({
  scripts: [],
  categories: [],
  loading: false,

  loadScripts: async () => {
    const d = await getDb()
    set({ loading: true })
    const scripts = (await d.select('SELECT * FROM scripts ORDER BY updated_at DESC')) as Script[]
    set({ scripts, loading: false })
  },

  loadCategories: async () => {
    const d = await getDb()
    const categories = (await d.select('SELECT * FROM script_categories ORDER BY sort_order, name')) as ScriptCategory[]
    set({ categories })
  },

  createScript: async (data: Partial<Script>) => {
    const d = await getDb()
    const result = await d.insert(
      'INSERT INTO scripts (name, content, language, category_id, description) VALUES (?, ?, ?, ?, ?)',
      [data.name || '未命名脚本', data.content || '', data.language || 'shell', data.category_id || null, data.description || '']
    )
    await get().loadScripts()
    return { ...data, id: result.lastInsertRowid } as Script
  },

  updateScript: async (id: number, data: Partial<Script>) => {
    const d = await getDb()
    const fields: string[] = []
    const params: unknown[] = []
    if (data.name !== undefined) { fields.push('name = ?'); params.push(data.name) }
    if (data.content !== undefined) { fields.push('content = ?'); params.push(data.content) }
    if (data.language !== undefined) { fields.push('language = ?'); params.push(data.language) }
    if (data.description !== undefined) { fields.push('description = ?'); params.push(data.description) }
    if (data.category_id !== undefined) { fields.push('category_id = ?'); params.push(data.category_id) }
    fields.push("updated_at = datetime('now','localtime')")
    params.push(id)
    await d.update(`UPDATE scripts SET ${fields.join(', ')} WHERE id = ?`, params)
    await get().loadScripts()
  },

  deleteScript: async (id: number) => {
    const d = await getDb()
    await d.delete('DELETE FROM scripts WHERE id = ?', [id])
    await get().loadScripts()
  },

  toggleFavorite: async (id: number) => {
    const d = await getDb()
    const script = get().scripts.find(s => s.id === id)
    if (!script) return
    await d.update('UPDATE scripts SET is_favorite = ?, updated_at = datetime(\'now\',\'localtime\') WHERE id = ?', [script.is_favorite ? 0 : 1, id])
    await get().loadScripts()
  },

  createCategory: async (name: string) => {
    const d = await getDb()
    await d.insert('INSERT OR IGNORE INTO script_categories (name, sort_order) VALUES (?, 0)', [name])
    await get().loadCategories()
  },

  deleteCategory: async (id: number) => {
    const d = await getDb()
    await d.delete('DELETE FROM script_categories WHERE id = ?', [id])
    await get().loadCategories()
  }
}))
