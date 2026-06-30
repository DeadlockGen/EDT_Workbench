import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from '@shared/types/ipc'

const electronAPI = {
  file: {
    open: (): Promise<string | null> => ipcRenderer.invoke(IPC_CHANNELS.FILE_OPEN),
    save: (content: string, defaultName?: string): Promise<boolean> =>
      ipcRenderer.invoke(IPC_CHANNELS.FILE_SAVE, content, defaultName),
    read: (filePath: string): Promise<string> => ipcRenderer.invoke(IPC_CHANNELS.FILE_READ, filePath),
    write: (filePath: string, content: string): Promise<void> =>
      ipcRenderer.invoke(IPC_CHANNELS.FILE_WRITE, filePath, content),
    select: (): Promise<string[]> => ipcRenderer.invoke(IPC_CHANNELS.FILE_SELECT)
  },
  dialog: {
    openFile: (filters?: { name: string; extensions: string[] }[]): Promise<string | null> =>
      ipcRenderer.invoke(IPC_CHANNELS.DIALOG_OPEN_FILE, filters),
    saveFile: (defaultName?: string, filters?: { name: string; extensions: string[] }[]): Promise<string | null> =>
      ipcRenderer.invoke(IPC_CHANNELS.DIALOG_SAVE_FILE, defaultName, filters),
    selectDir: (): Promise<string | null> => ipcRenderer.invoke(IPC_CHANNELS.DIALOG_SELECT_DIR)
  },
  clipboard: {
    read: (): Promise<string> => ipcRenderer.invoke(IPC_CHANNELS.CLIPBOARD_READ),
    write: (text: string): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.CLIPBOARD_WRITE, text)
  },
  db: {
    exec: (sql: string, params?: unknown[]): Promise<{ changes: number; lastInsertRowid: number }> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_EXEC, sql, params),
    select: (sql: string, params?: unknown[]): Promise<unknown[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_SELECT, sql, params),
    insert: (sql: string, params?: unknown[]): Promise<{ lastInsertRowid: number }> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_INSERT, sql, params),
    update: (sql: string, params?: unknown[]): Promise<{ changes: number }> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_UPDATE, sql, params),
    delete: (sql: string, params?: unknown[]): Promise<{ changes: number }> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_DELETE, sql, params)
  },
  app: {
    getVersion: (): Promise<string> => ipcRenderer.invoke(IPC_CHANNELS.APP_GET_VERSION),
    getPlatform: (): Promise<string> => ipcRenderer.invoke(IPC_CHANNELS.APP_GET_PLATFORM)
  }
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)
