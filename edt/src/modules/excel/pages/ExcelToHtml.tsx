import { useState, useCallback } from 'react'
import { Button } from 'antd'
import * as XLSX from 'xlsx'
import { FormatEditor } from '@/components/editor/MonacoEditor'

function jsonToHtmlTable(json: Record<string, unknown>[]): string {
  if (json.length === 0) return '<table><tr><td>No data</td></tr></table>'
  const cols = Object.keys(json[0])
  const header = cols.map(c => `<th>${c}</th>`).join('')
  const rows = json.map(row => {
    const cells = cols.map(c => `<td>${row[c] ?? ''}</td>`).join('')
    return `<tr>${cells}</tr>`
  }).join('\n')
  return `<table>\n  <thead>\n    <tr>${header}</tr>\n  </thead>\n  <tbody>\n${rows}\n  </tbody>\n</table>`
}

export function ExcelToHtml() {
  const [output, setOutput] = useState('')
  const [preview, setPreview] = useState('')

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
          const html = jsonToHtmlTable(json)
          setOutput(html)
          setPreview(`<style>table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid #ccc; padding: 6px; text-align: left; } th { background: #f5f5f5; }</style>\n${html}`)
        } catch {
          setOutput('转换失败')
        }
      }
      reader.readAsArrayBuffer(file)
    }
    input.click()
  }, [])

  return (
    <div className="h-full flex flex-col gap-2" style={{ padding: 12 }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">Excel → HTML</span>
        <Button size="small" onClick={handleFile}>选择 Excel 文件</Button>
      </div>
      {output && (
        <div className="flex-1 grid grid-cols-2 gap-2 min-h-0">
          <div className="flex flex-col gap-1">
            <span className="text-xs">HTML 源码</span>
            <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
              <FormatEditor value={output} language="html" readOnly />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs">预览</span>
            <div className="flex-1 border rounded overflow-auto p-2" style={{ borderColor: 'var(--ant-color-border)' }}>
              <div dangerouslySetInnerHTML={{ __html: preview }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
