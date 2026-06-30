/// <reference types="vite/client" />

interface ElectronAPI {
  file: {
    open: () => Promise<string | null>
    save: (content: string, defaultName?: string) => Promise<boolean>
    read: (filePath: string) => Promise<string>
    write: (filePath: string, content: string) => Promise<void>
    select: () => Promise<string[]>
  }
  dialog: {
    openFile: (filters?: { name: string; extensions: string[] }[]) => Promise<string | null>
    saveFile: (defaultName?: string, filters?: { name: string; extensions: string[] }[]) => Promise<string | null>
    selectDir: () => Promise<string | null>
  }
  clipboard: {
    read: () => Promise<string>
    write: (text: string) => Promise<void>
  }
  db: {
    exec: (sql: string, params?: unknown[]) => Promise<{ changes: number; lastInsertRowid: number }>
    select: (sql: string, params?: unknown[]) => Promise<unknown[]>
    insert: (sql: string, params?: unknown[]) => Promise<{ lastInsertRowid: number }>
    update: (sql: string, params?: unknown[]) => Promise<{ changes: number }>
    delete: (sql: string, params?: unknown[]) => Promise<{ changes: number }>
  }
  app: {
    getVersion: () => Promise<string>
    getPlatform: () => Promise<string>
  }
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
