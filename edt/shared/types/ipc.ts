export const IPC_CHANNELS = {
  FILE_OPEN: 'file:open',
  FILE_SAVE: 'file:save',
  FILE_READ: 'file:read',
  FILE_WRITE: 'file:write',
  FILE_SELECT: 'file:select',

  CLIPBOARD_READ: 'clipboard:read',
  CLIPBOARD_WRITE: 'clipboard:write',

  DIALOG_OPEN_FILE: 'dialog:openFile',
  DIALOG_SAVE_FILE: 'dialog:saveFile',
  DIALOG_SELECT_DIR: 'dialog:selectDir',

  DB_EXEC: 'db:exec',
  DB_SELECT: 'db:select',
  DB_INSERT: 'db:insert',
  DB_UPDATE: 'db:update',
  DB_DELETE: 'db:delete',

  APP_GET_VERSION: 'app:getVersion',
  APP_GET_PLATFORM: 'app:getPlatform'
} as const

export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS]
