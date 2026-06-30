type DbExecResult = { changes: number; lastInsertRowid: number }

interface DbApi {
  exec: (sql: string, params?: unknown[]) => Promise<DbExecResult>
  select: (sql: string, params?: unknown[]) => Promise<Record<string, unknown>[]>
  insert: (sql: string, params?: unknown[]) => Promise<{ lastInsertRowid: number }>
  update: (sql: string, params?: unknown[]) => Promise<{ changes: number }>
  delete: (sql: string, params?: unknown[]) => Promise<{ changes: number }>
}

const STORAGE_KEY = 'edt_db_tables'

interface TableSchema {
  columns: { name: string; type: string; primaryKey?: boolean; unique?: boolean; foreignKey?: { table: string; onDelete?: string; onUpdate?: string }; default?: unknown }
}

interface WebTable {
  schema: TableSchema
  rows: Record<string, unknown>[]
  nextId: number
}

type Tables = Record<string, WebTable>

let dbApi: DbApi | null = null

function electronDb(): DbApi | null {
  const api = (window as any).electronAPI?.db
  return api || null
}

function loadTables(): Tables {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveTables(tables: Tables): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tables))
}

function now(): string {
  const d = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const SCHEMAS: Record<string, TableSchema> = {
  scripts: {
    columns: [
      { name: 'id', type: 'INTEGER', primaryKey: true },
      { name: 'name', type: 'TEXT' },
      { name: 'content', type: 'TEXT', default: '' },
      { name: 'language', type: 'TEXT', default: 'shell' },
      { name: 'category_id', type: 'INTEGER' },
      { name: 'is_favorite', type: 'INTEGER', default: 0 },
      { name: 'description', type: 'TEXT', default: '' },
      { name: 'created_at', type: 'TEXT' },
      { name: 'updated_at', type: 'TEXT' },
    ]
  },
  script_categories: {
    columns: [
      { name: 'id', type: 'INTEGER', primaryKey: true },
      { name: 'name', type: 'TEXT', unique: true },
      { name: 'parent_id', type: 'INTEGER' },
      { name: 'sort_order', type: 'INTEGER', default: 0 },
      { name: 'created_at', type: 'TEXT' },
    ]
  },
  script_tags: {
    columns: [
      { name: 'id', type: 'INTEGER', primaryKey: true },
      { name: 'script_id', type: 'INTEGER' },
      { name: 'tag', type: 'TEXT' },
      { name: 'created_at', type: 'TEXT' },
    ]
  },
  command_favorites: {
    columns: [
      { name: 'id', type: 'INTEGER', primaryKey: true },
      { name: 'command_key', type: 'TEXT', unique: true },
      { name: 'category', type: 'TEXT' },
      { name: 'label', type: 'TEXT', default: '' },
      { name: 'created_at', type: 'TEXT' },
    ]
  },
  favorites: {
    columns: [
      { name: 'id', type: 'INTEGER', primaryKey: true },
      { name: 'type', type: 'TEXT' },
      { name: 'ref_id', type: 'TEXT' },
      { name: 'created_at', type: 'TEXT' },
    ]
  },
  app_settings: {
    columns: [
      { name: 'key', type: 'TEXT', primaryKey: true },
      { name: 'value', type: 'TEXT' },
      { name: 'updated_at', type: 'TEXT' },
    ]
  }
}

type WhereClause = { field: string; op: string; value: unknown }[]

function parseWhere(sql: string, params?: unknown[]): WhereClause {
  const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+ORDER\s+BY|\s+LIMIT|\s*$)/i)
  if (!whereMatch) return []

  const conditions: WhereClause = []
  // Simple parser for AND-connected conditions
  const parts = whereMatch[1].split(/\s+AND\s+/i)
  let paramIdx = 0
  for (const part of parts) {
    const match = part.match(/(\w+)\s*(=|!=|<>|<|>|<=|>=|LIKE|IN|IS\s+NULL|IS\s+NOT\s+NULL)\s*(.*)/i)
    if (match) {
      const [, field, op, maybePlaceholder] = match
      const trimmedOp = op.toUpperCase()
      if (trimmedOp === 'IS NULL' || trimmedOp === 'IS NOT NULL') {
        conditions.push({ field, op: trimmedOp, value: null })
      } else if (maybePlaceholder.trim() === '?') {
        conditions.push({ field, op: trimmedOp, value: params?.[paramIdx++] })
      } else if (maybePlaceholder.trim().toUpperCase() === 'NULL') {
        conditions.push({ field, op: '=', value: null })
      }
    }
  }
  return conditions
}

function matchesRow(row: Record<string, unknown>, where: WhereClause): boolean {
  for (const cond of where) {
    const rowVal = row[cond.field]
    switch (cond.op) {
      case '=': if (rowVal !== cond.value && String(rowVal) !== String(cond.value)) return false; break
      case 'IS NULL': if (rowVal !== null && rowVal !== undefined) return false; break
      case 'IS NOT NULL': if (rowVal === null || rowVal === undefined) return false; break
      case '!=': case '<>': if (rowVal == cond.value) return false; break
      default: return false
    }
  }
  return true
}

function getTable(tables: Tables, name: string): WebTable {
  if (!tables[name]) {
    tables[name] = { schema: SCHEMAS[name], rows: [], nextId: 1 }
  }
  return tables[name]
}

function getSortField(sql: string): string | null {
  const m = sql.match(/ORDER\s+BY\s+(\w+)(?:\s+(ASC|DESC))?/i)
  return m ? m[1].toLowerCase() : null
}

function getSortDir(sql: string): 'asc' | 'desc' {
  const m = sql.match(/ORDER\s+BY\s+\w+\s+(ASC|DESC)/i)
  return m?.[1].toUpperCase() === 'DESC' ? 'desc' : 'asc'
}

function applyDefaults(row: Record<string, unknown>, schema: TableSchema): Record<string, unknown> {
  const r = { ...row }
  for (const col of schema.columns) {
    if (col.default !== undefined && r[col.name] === undefined) {
      r[col.name] = typeof col.default === 'function' ? (col.default as () => unknown)() : col.default
    }
  }
  return r
}

async function webDb(): Promise<DbApi> {
  // Initialize tables
  const tables = loadTables()
  for (const name of Object.keys(SCHEMAS)) {
    if (!tables[name]) {
      tables[name] = { schema: SCHEMAS[name], rows: [], nextId: 1 }
    }
  }
  saveTables(tables)

  function insertSql(sql: string, params?: unknown[]): { lastInsertRowid: number } {
    const match = sql.match(/INSERT\s+(?:OR\s+IGNORE\s+)?INTO\s+(\w+)\s*\((.*?)\)\s*VALUES\s*\((.*?)\)/i)
    if (!match) return { lastInsertRowid: 0 }

    const tableName = match[1].toLowerCase()
    const fields = match[2].split(',').map(f => f.trim())
    const placeholders = match[3].split(',').map(f => f.trim())

    const table = getTable(tables, tableName)
    const isIgnore = /INSERT\s+OR\s+IGNORE/i.test(sql)

    // Check unique constraints
    const uniqueCols = table.schema.columns.filter(c => c.unique).map(c => c.name)
    const row: Record<string, unknown> = { id: table.nextId }
    let paramIdx = 0

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i]
      if (field.toLowerCase() === 'id') continue
      const val = placeholders[i] === '?' ? params?.[paramIdx++] : placeholders[i]
      // Strip quotes from string literals
      row[field] = typeof val === 'string' && val.startsWith("'") ? val.slice(1, -1) : val
    }

    // Check unique violation for OR IGNORE
    if (isIgnore) {
      for (const existing of table.rows) {
        let dup = true
        for (const col of uniqueCols) {
          if (existing[col] !== row[col]) { dup = false; break }
        }
        if (dup) return { lastInsertRowid: 0 }
      }
    } else {
      for (const existing of table.rows) {
        for (const col of uniqueCols) {
          if (existing[col] === row[col]) {
            throw new Error(`UNIQUE constraint failed: ${tableName}.${col}`)
          }
        }
      }
    }

    const fullRow = applyDefaults(row, table.schema)
    if (!fullRow.created_at) fullRow.created_at = now()
    if (!fullRow.updated_at) fullRow.updated_at = now()
    fullRow.id = table.nextId
    table.nextId++
    table.rows.push(fullRow)
    saveTables(tables)
    return { lastInsertRowid: fullRow.id as number }
  }

  function selectSql(sql: string, params?: unknown[]): Record<string, unknown>[] {
    // Parse FROM table
    const fromMatch = sql.match(/FROM\s+(\w+)/i)
    if (!fromMatch) return []
    const tableName = fromMatch[1].toLowerCase()
    const table = getTable(tables, tableName)

    let rows = table.rows
    const where = parseWhere(sql, params)
    if (where.length > 0) {
      rows = rows.filter(r => matchesRow(r, where))
    }

    const sortField = getSortField(sql)
    if (sortField) {
      const dir = getSortDir(sql)
      rows = [...rows].sort((a, b) => {
        const va = a[sortField] ?? ''
        const vb = b[sortField] ?? ''
        if (dir === 'desc') return String(vb).localeCompare(String(va))
        return String(va).localeCompare(String(vb))
      })
    }

    return rows
  }

  function parseSetClause(setSql: string, params?: unknown[]): { setters: { field: string; value: unknown }[]; consumed: number } {
    const setters: { field: string; value: unknown }[] = []
    let paramIdx = 0
    let i = 0

    while (i < setSql.length) {
      // skip spaces and commas
      while (i < setSql.length && (setSql[i] === ' ' || setSql[i] === ',')) i++
      if (i >= setSql.length) break

      // parse field name
      const fieldMatch = setSql.slice(i).match(/^(\w+)\s*=\s*/)
      if (!fieldMatch) break
      i += fieldMatch[0].length
      const field = fieldMatch[1]

      // parse value — could be '?' or a string literal or function call
      if (setSql[i] === '?') {
        setters.push({ field, value: params?.[paramIdx++] })
        i++
      } else if (setSql[i] === "'") {
        // string literal
        i++ // skip opening quote
        let val = ''
        while (i < setSql.length && setSql[i] !== "'") {
          if (setSql[i] === '\\') { val += setSql[i + 1]; i += 2 }
          else { val += setSql[i]; i++ }
        }
        i++ // skip closing quote
        setters.push({ field, value: val })
      } else {
        // function call (e.g. datetime(...)) or number
        let depth = 0
        let val = ''
        while (i < setSql.length) {
          if (setSql[i] === '(') depth++
          else if (setSql[i] === ')') { depth--; if (depth < 0) break }
          else if (setSql[i] === ',' && depth === 0) break
          val += setSql[i]
          i++
        }
        const trimmed = val.trim()
        // Evaluate known functions
        if (/^datetime\s*\(/i.test(trimmed)) {
          setters.push({ field, value: now() })
        } else {
          setters.push({ field, value: isNaN(Number(trimmed)) ? trimmed : Number(trimmed) })
        }
      }
    }
    return { setters, consumed: paramIdx }
  }

  function updateSql(sql: string, params?: unknown[]): { changes: number } {
    const match = sql.match(/UPDATE\s+(\w+)\s+SET\s+(.*?)(?:\s+WHERE\s+.*)?$/i)
    if (!match) return { changes: 0 }

    const tableName = match[1].toLowerCase()
    const table = getTable(tables, tableName)

    const { setters, consumed: setConsumed } = parseSetClause(match[2], params)

    let rows = table.rows
    const where = parseWhere(sql, params?.slice(setConsumed))
    if (where.length > 0) {
      rows = rows.filter(r => matchesRow(r, where))
    }

    for (const row of rows) {
      for (const setter of setters) {
        row[setter.field] = setter.value
      }
    }

    saveTables(tables)
    return { changes: rows.length }
  }

  function deleteSql(sql: string, params?: unknown[]): { changes: number } {
    const match = sql.match(/DELETE\s+FROM\s+(\w+)/i)
    if (!match) return { changes: 0 }

    const tableName = match[1].toLowerCase()
    const table = getTable(tables, tableName)

    const where = parseWhere(sql, params)
    if (where.length > 0) {
      const before = table.rows.length
      table.rows = table.rows.filter(r => !matchesRow(r, where))
      const changes = before - table.rows.length
      saveTables(tables)
      return { changes }
    }

    // DELETE without WHERE = truncate
    const changes = table.rows.length
    table.rows = []
    saveTables(tables)
    return { changes }
  }

  return {
    exec: async (sql: string, params?: unknown[]) => {
      const upper = sql.trim().toUpperCase()
      if (upper.startsWith('INSERT')) return insertSql(sql, params)
      if (upper.startsWith('UPDATE')) return updateSql(sql, params)
      if (upper.startsWith('DELETE')) return deleteSql(sql, params)
      // DDL, PRAGMA etc. - just return no-op
      return { changes: 0, lastInsertRowid: 0 }
    },

    select: async (sql: string, params?: unknown[]) => selectSql(sql, params),

    insert: async (sql: string, params?: unknown[]) => insertSql(sql, params),

    update: async (sql: string, params?: unknown[]) => updateSql(sql, params),

    delete: async (sql: string, params?: unknown[]) => deleteSql(sql, params),
  }
}

export async function getDb(): Promise<DbApi> {
  if (dbApi) return dbApi
  dbApi = electronDb() || await webDb()
  return dbApi
}
