import { useState, useCallback } from 'react'
import { Button, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import { PageHeader } from '@/components/common/PageHeader'
import { SplitPanel } from '@/components/layout/SplitPanel'
import { FormatEditor } from '@/components/editor/MonacoEditor'

export function CsvExcelConvert() {
  const [csvData, setCsvData] = useState('')

  const handleCsvToExcel = useCallback(() => {
    if (!csvData.trim()) return
    try {
      const result = Papa.parse(csvData, { header: false })
      const ws = XLSX.utils.aoa_to_sheet(result.data as unknown[][])
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
      XLSX.writeFile(wb, 'output.xlsx')
      message.success('Excel 文件已下载')
    } catch (e) {
      message.error('转换失败: ' + (e as Error).message)
    }
  }, [csvData])

  const handleExcelToCsv = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.xlsx,.xls'
    input.onchange = (e: any) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        const data = new Uint8Array(ev.target!.result as ArrayBuffer)
        const wb = XLSX.read(data, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json(ws, { header: 1 })
        const csv = Papa.unparse(json as any[][])
        setCsvData(csv)
      }
      reader.readAsArrayBuffer(file)
    }
    input.click()
  }, [])

  return (
    <div className="h-full flex flex-col">
      <PageHeader title="CSV ↔ Excel" subtitle="CSV 与 Excel 互转" />
      <div className="flex items-center gap-2 mb-2">
        <Button size="small" onClick={handleExcelToCsv}><UploadOutlined /> 选择 Excel → CSV</Button>
        <Button type="primary" size="small" onClick={handleCsvToExcel}>CSV → Excel (下载)</Button>
      </div>
      <div className="flex-1 min-h-0">
        <SplitPanel
          left={
            <div className="h-full flex flex-col">
              <div className="text-xs mb-1" style={{ color: 'var(--ant-color-text-description)' }}>CSV 数据</div>
              <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
                <FormatEditor value={csvData} onChange={setCsvData} language="csv" />
              </div>
            </div>
          }
          right={
            <div className="h-full flex flex-col">
              <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
                <FormatEditor value={csvData || ''} language="csv" readOnly />
              </div>
            </div>
          }
        />
      </div>
    </div>
  )
}
