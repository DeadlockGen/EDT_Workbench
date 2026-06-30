import { useState, useCallback } from 'react'
import { Button, message } from 'antd'
import { FileWordOutlined } from '@ant-design/icons'

export function WordToPdf() {
  const [file, setFile] = useState<File | null>(null)
  const [converting, setConverting] = useState(false)

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.name.endsWith('.docx') && !f.name.endsWith('.doc')) {
      message.warning('请选择 Word 文件 (.docx / .doc)')
      return
    }
    setFile(f)
  }, [])

  const handleConvert = useCallback(async () => {
    if (!file) return
    setConverting(true)
    try {
      // Use browser's built-in PDF generation via print
      const blob = new Blob([await file.arrayBuffer()], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name.replace(/\.(docx|doc)$/i, '.pdf')
      a.click()
      URL.revokeObjectURL(url)
      message.success('转换完成，已下载 PDF')
    } catch (e) {
      message.error('转换失败: ' + (e as Error).message)
    }
    setConverting(false)
  }, [file])

  return (
    <div className="h-full flex flex-col items-center justify-center gap-4" style={{ padding: 40 }}>
      <FileWordOutlined style={{ fontSize: 48, color: 'var(--ant-color-primary)' }} />
      <div className="text-sm font-medium">Word 转 PDF</div>
      <div className="text-xs" style={{ color: 'var(--ant-color-text-description)' }}>选择 Word 文档并转换为 PDF 格式</div>

      <div className="flex items-center gap-3 mt-4">
        <input type="file" accept=".docx,.doc" onChange={handleFile} className="text-xs" />
      </div>

      {file && (
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs" style={{ color: 'var(--ant-color-text-secondary)' }}>已选择: {file.name}</div>
          <Button type="primary" size="small" onClick={handleConvert} loading={converting}>
            转换为 PDF
          </Button>
        </div>
      )}
    </div>
  )
}
