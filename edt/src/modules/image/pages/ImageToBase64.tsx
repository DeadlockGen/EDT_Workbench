import { useState, useCallback } from 'react'
import { Button } from 'antd'
import { PageHeader } from '@/components/common/PageHeader'
import { ResultPanel } from '@/components/common/ResultPanel'
import { SplitPanel } from '@/components/layout/SplitPanel'
import { FormatEditor } from '@/components/editor/MonacoEditor'

export function ImageToBase64() {
  const [preview, setPreview] = useState('')
  const [base64, setBase64] = useState('')

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setPreview(result)
      setBase64(result)
    }
    reader.readAsDataURL(f)
  }, [])

  const handleClear = useCallback(() => {
    setPreview('')
    setBase64('')
  }, [])

  return (
    <div className="h-full flex flex-col gap-3">
      <PageHeader title="Base64 图片转换" subtitle="将图片转为 Base64 编码" extra={<Button size="small" onClick={handleClear}>清空</Button>} />
      <input type="file" accept="image/*" onChange={handleFile} className="text-xs" />
      <div className="flex-1 min-h-0">
        <SplitPanel
          left={
            <div className="h-full flex flex-col">
              {preview && <img src={preview} className="max-h-48 object-contain mb-2 border rounded" style={{ borderColor: 'var(--ant-color-border)' }} />}
              {base64 && <ResultPanel title="Base64 编码" content={base64.length > 500 ? base64.substring(0, 500) + '...' : base64} />}
            </div>
          }
          right={
            <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
              <FormatEditor value={base64 || ''} language="plaintext" readOnly />
            </div>
          }
        />
      </div>
    </div>
  )
}
