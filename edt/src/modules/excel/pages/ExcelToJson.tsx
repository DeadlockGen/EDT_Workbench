import { useState, useCallback } from 'react'
import { Button, Select, Space, message } from 'antd'
import * as XLSX from 'xlsx'
import { PageHeader } from '@/components/common/PageHeader'
import { FormatEditor } from '@/components/editor/MonacoEditor'

export function ExcelToJson() {
  const [output, setOutput] = useState('')
  const [format, setFormat] = useState('pretty')

  const handleFile = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.xlsx,.xls'
    input.onchange = (e: any) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = new Uint8Array(ev.target!.result as ArrayBuffer)
          const wb = XLSX.read(data, { type: 'array' })
          const ws = wb.Sheets[wb.SheetNames[0]]
          const json = XLSX.utils.sheet_to_json(ws)
          setOutput(JSON.stringify(json, null, format === 'pretty' ? 2 : 0))
          message.success(`已转换 ${json.length} 行数据`)
        } catch (e) {
          message.error('转换失败: ' + (e as Error).message)
        }
      }
      reader.readAsArrayBuffer(file)
    }
    input.click()
  }, [format])

  return (
    <div className="h-full flex flex-col gap-3">
      <PageHeader title="Excel → JSON" extra={
        <Space>
          <Select size="small" value={format} onChange={setFormat} style={{ width: 100 }}
            options={[{ value: 'pretty', label: '格式化' }, { value: 'compact', label: '紧凑' }]} />
          <Button type="primary" size="small" onClick={handleFile}>选择 Excel 文件</Button>
        </Space>
      } />
      {output && (
        <div className="flex-1 min-h-0 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
          <FormatEditor value={output} language="json" readOnly />
        </div>
      )}
    </div>
  )
}
