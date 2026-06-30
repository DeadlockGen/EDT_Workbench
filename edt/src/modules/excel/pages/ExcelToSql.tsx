import { useState, useCallback } from 'react'
import { Button, message } from 'antd'
import * as XLSX from 'xlsx'
import { PageHeader } from '@/components/common/PageHeader'
import { FormatEditor } from '@/components/editor/MonacoEditor'

export function ExcelToSql() {
  const [output, setOutput] = useState('')
  const [tableName, setTableName] = useState('imported_data')

  const handleFile = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.xlsx,.xls'
    input.onchange = (e: any) => {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = new Uint8Array(ev.target!.result as ArrayBuffer)
          const wb = XLSX.read(data, { type: 'array' })
          const ws = wb.Sheets[wb.SheetNames[0]]
          const json = XLSX.utils.sheet_to_json(ws) as Record<string, unknown>[]
          if (json.length === 0) { message.warning('数据为空'); return }

          const columns = Object.keys(json[0])
          const colDefs = columns.map(c => `\`${c}\` TEXT`).join(',\n  ')
          const values = json.map(row => {
            const vals = columns.map(c => {
              const v = row[c]
              if (v === null || v === undefined) return 'NULL'
              return `'${String(v).replace(/'/g, "''")}'`
            })
            return `(${vals.join(', ')})`
          }).join(',\n')

          const sql = `CREATE TABLE IF NOT EXISTS \`${tableName}\` (\n  ${colDefs}\n);\n\nINSERT INTO \`${tableName}\` VALUES\n${values};`
          setOutput(sql)
          message.success(`已生成 ${json.length} 条 INSERT`)
        } catch (e) {
          message.error('转换失败: ' + (e as Error).message)
        }
      }
      reader.readAsArrayBuffer(file)
    }
    input.click()
  }, [tableName])

  return (
    <div className="h-full flex flex-col gap-3">
      <PageHeader title="Excel → SQL" subtitle="将 Excel 数据转为 INSERT 语句" />
      <div className="flex items-center gap-2">
        <span className="text-xs">表名:</span>
        <input className="border rounded text-xs px-2 py-0.5" value={tableName} onChange={e => setTableName(e.target.value)} style={{ borderColor: 'var(--ant-color-border)' }} />
        <Button type="primary" size="small" onClick={handleFile}>选择 Excel 文件</Button>
      </div>
      {output && <div className="flex-1 min-h-0 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
        <FormatEditor value={output} language="sql" readOnly />
      </div>}
    </div>
  )
}
