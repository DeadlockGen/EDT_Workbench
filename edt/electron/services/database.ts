import initSqlJs, { Database as SqlJsDatabase } from 'sql.js'
import { join } from 'path'
import { app } from 'electron'
import { readFileSync, writeFileSync, existsSync } from 'fs'

let db: SqlJsDatabase | null = null
let dbPath: string = ''

async function loadDatabase(): Promise<SqlJsDatabase> {
  const SQL = await initSqlJs()
  dbPath = join(app.getPath('userData'), 'edt.db')

  if (existsSync(dbPath)) {
    const buffer = readFileSync(dbPath)
    return new SQL.Database(buffer)
  }
  return new SQL.Database()
}

function saveDatabase(): void {
  if (!db || !dbPath) return
  const data = db.export()
  const buffer = Buffer.from(data)
  writeFileSync(dbPath, buffer)
}

export async function initDatabase(): Promise<void> {
  db = await loadDatabase()

  db.run('PRAGMA journal_mode = WAL')
  db.run('PRAGMA foreign_keys = ON')

  db.run(`
    CREATE TABLE IF NOT EXISTS scripts (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      content     TEXT NOT NULL DEFAULT '',
      language    TEXT NOT NULL DEFAULT 'shell',
      category_id INTEGER,
      is_favorite INTEGER NOT NULL DEFAULT 0,
      description TEXT DEFAULT '',
      created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime')),
      updated_at  TEXT NOT NULL DEFAULT (datetime('now','localtime')),
      FOREIGN KEY (category_id) REFERENCES script_categories(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS script_categories (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL UNIQUE,
      parent_id   INTEGER DEFAULT NULL,
      sort_order  INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime')),
      FOREIGN KEY (parent_id) REFERENCES script_categories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS script_tags (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      script_id   INTEGER NOT NULL,
      tag         TEXT NOT NULL,
      created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime')),
      FOREIGN KEY (script_id) REFERENCES scripts(id) ON DELETE CASCADE,
      UNIQUE(script_id, tag)
    );

    CREATE TABLE IF NOT EXISTS command_favorites (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      command_key TEXT NOT NULL,
      category    TEXT NOT NULL,
      label       TEXT NOT NULL DEFAULT '',
      created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime')),
      UNIQUE(command_key)
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      type        TEXT NOT NULL,
      ref_id      TEXT NOT NULL,
      created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime')),
      UNIQUE(type, ref_id)
    );

    CREATE TABLE IF NOT EXISTS app_settings (
      key         TEXT PRIMARY KEY,
      value       TEXT NOT NULL,
      updated_at  TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    );
  `)

  saveDatabase()
}

export function getDatabase(): SqlJsDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.')
  }
  return db
}

export function persistDatabase(): void {
  saveDatabase()
}

export function dbExec(sql: string, params?: unknown[]): { changes: number; lastInsertRowid: number } {
  const database = getDatabase()
  database.run(sql, params || [])
  const result = database.exec('SELECT changes() AS changes, last_insert_rowid() AS lastInsertRowid')
  const row = result[0]?.values[0]
  return {
    changes: row ? Number(row[0]) : 0,
    lastInsertRowid: row ? Number(row[1]) : 0
  }
}

export function dbSelect(sql: string, params?: unknown[]): Record<string, unknown>[] {
  const database = getDatabase()
  const stmt = database.prepare(sql)
  if (params) stmt.bind(params)
  const rows: Record<string, unknown>[] = []
  while (stmt.step()) {
    const row = stmt.getAsObject()
    rows.push(row)
  }
  stmt.free()
  return rows
}
