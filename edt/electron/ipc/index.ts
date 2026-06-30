import { ipcMain, dialog, clipboard } from 'electron'
import { readFileSync, writeFileSync } from 'fs'
import { IPC_CHANNELS } from '@shared/types/ipc'
import { dbExec, dbSelect, persistDatabase } from '../services/database'

export function registerIpcHandlers(): void {
  // File operations
  ipcMain.handle(IPC_CHANNELS.FILE_OPEN, async () => {
    const result = await dialog.showOpenDialog({ properties: ['openFile'] })
    if (result.canceled) return null
    return readFileSync(result.filePaths[0], 'utf-8')
  })

  ipcMain.handle(IPC_CHANNELS.FILE_SAVE, async (_event, content: string, defaultName?: string) => {
    const result = await dialog.showSaveDialog({ defaultPath: defaultName })
    if (result.canceled) return false
    writeFileSync(result.filePath!, content, 'utf-8')
    return true
  })

  ipcMain.handle(IPC_CHANNELS.FILE_READ, async (_event, filePath: string) => {
    return readFileSync(filePath, 'utf-8')
  })

  ipcMain.handle(IPC_CHANNELS.FILE_WRITE, async (_event, filePath: string, content: string) => {
    writeFileSync(filePath, content, 'utf-8')
  })

  ipcMain.handle(IPC_CHANNELS.FILE_SELECT, async () => {
    const result = await dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })
    if (result.canceled) return []
    return result.filePaths
  })

  // Clipboard
  ipcMain.handle(IPC_CHANNELS.CLIPBOARD_READ, async () => {
    return clipboard.readText()
  })

  ipcMain.handle(IPC_CHANNELS.CLIPBOARD_WRITE, async (_event, text: string) => {
    clipboard.writeText(text)
  })

  // Dialogs
  ipcMain.handle(IPC_CHANNELS.DIALOG_OPEN_FILE, async (_event, filters) => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters
    })
    if (result.canceled) return null
    return result.filePaths[0]
  })

  ipcMain.handle(IPC_CHANNELS.DIALOG_SAVE_FILE, async (_event, defaultName, filters) => {
    const result = await dialog.showSaveDialog({
      defaultPath: defaultName,
      filters
    })
    if (result.canceled) return null
    return result.filePath
  })

  ipcMain.handle(IPC_CHANNELS.DIALOG_SELECT_DIR, async () => {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    if (result.canceled) return null
    return result.filePaths[0]
  })

  // Database using sql.js
  ipcMain.handle(IPC_CHANNELS.DB_EXEC, async (_event, sql: string, params?: unknown[]) => {
    const result = dbExec(sql, params)
    persistDatabase()
    return result
  })

  ipcMain.handle(IPC_CHANNELS.DB_SELECT, async (_event, sql: string, params?: unknown[]) => {
    return dbSelect(sql, params)
  })

  ipcMain.handle(IPC_CHANNELS.DB_INSERT, async (_event, sql: string, params?: unknown[]) => {
    const result = dbExec(sql, params)
    persistDatabase()
    return { lastInsertRowid: result.lastInsertRowid }
  })

  ipcMain.handle(IPC_CHANNELS.DB_UPDATE, async (_event, sql: string, params?: unknown[]) => {
    const result = dbExec(sql, params)
    persistDatabase()
    return { changes: result.changes }
  })

  ipcMain.handle(IPC_CHANNELS.DB_DELETE, async (_event, sql: string, params?: unknown[]) => {
    const result = dbExec(sql, params)
    persistDatabase()
    return { changes: result.changes }
  })

  // App info
  ipcMain.handle(IPC_CHANNELS.APP_GET_VERSION, async () => {
    return process.env.npm_package_version || '0.1.0'
  })

  ipcMain.handle(IPC_CHANNELS.APP_GET_PLATFORM, async () => {
    return process.platform
  })
}
