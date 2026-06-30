import { useState, useCallback } from 'react'
import { Button, message } from 'antd'
import * as XLSX from 'xlsx'
import { PageHeader } from '@/components/common/PageHeader'
import { FormatEditor } from '@/components/editor/MonacoEditor'

function toMarkdown(data: Record<string, unknown>[]): string {
  if (data.length === 0) return ''
  const cols = Object.keys(data[0])
  const header = `| ${cols.map(c => c.replace(/|/g, '\\|')).join(' | ')} |`
  const sep = `| ${cols.map(() => '---').join(' | ')} |`
  const rows = data.map(row => {
    return `| ${cols.map(c => {
      const v = String(row[c] ?? '')
      return v.replace(/\|/g, '\\|')
    }).join(' | ')} |`
  })
  return [header, sep, ...rows].join('\n')
}

export function ExcelToMarkdown() {
  const [output, setOutput] = useState('')

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
          setOutput(toMarkdown(json))
          message.success(`已转换 ${json.length} 行`)
        } catch (e) {
          message.error('转换失败: ' + (e as Error).message)
        }
      }
      reader.readAsArrayBuffer(file)
    }
    input.click()
  }, [])

  return (
    <div className="h-full flex flex-col gap-3">
      <PageHeader title="Excel → Markdown" subtitle="将 Excel 转为 Markdown 表格" />
      <Button type="primary" size="small" className="self-start" onClick={handleFile}>选择 Excel 文件</Button>
      {output && <div className="flex-1 min-h-0 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
        <FormatEditor value={output} language="markdown" readOnly />
      </div>}
    </div>
  )
}
