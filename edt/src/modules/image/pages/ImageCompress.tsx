import { useState, useCallback } from 'react'
import { Button, InputNumber, message } from 'antd'
import { PageHeader } from '@/components/common/PageHeader'
import { formatBytes } from '@/utils/format'

export function ImageCompress() {
  const [file, setFile] = useState<File | null>(null)
  const [quality, setQuality] = useState(80)
  const [preview, setPreview] = useState('')
  const [compressedSize, setCompressedSize] = useState(0)

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith('image/')) {
      message.warning('请选择图片文件')
      return
    }
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setCompressedSize(0)
  }, [])

  const handleCompress = useCallback(() => {
    if (!file) return
    const canvas = document.createElement('canvas')
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage(img, 0, 0)
      canvas.toBlob(blob => {
        if (blob) setCompressedSize(blob.size)
      }, file.type, quality / 100)
    }
    img.src = URL.createObjectURL(file)
  }, [file, quality])

  return (
    <div className="h-full flex flex-col gap-3">
      <PageHeader title="图片压缩" subtitle="调整 JPEG/PNG 图片质量" />
      <div className="flex items-center gap-3">
        <input type="file" accept="image/*" onChange={handleFileChange} className="text-xs" />
        <InputNumber size="small" value={quality} onChange={v => setQuality(v || 80)} min={1} max={100} addonAfter="%" style={{ width: 120 }} />
        <Button type="primary" size="small" onClick={handleCompress} disabled={!file}>压缩</Button>
      </div>
      {file && (
        <div className="flex-1 flex gap-3 min-h-0">
          <div className="flex-1 border rounded overflow-hidden" style={{ borderColor: 'var(--ant-color-border)' }}>
            <div className="text-xs px-2 py-1 border-b" style={{ borderColor: 'var(--ant-color-border)' }}>原图 ({formatBytes(file.size)})</div>
            <img src={preview} className="max-w-full max-h-full object-contain" />
          </div>
          {compressedSize > 0 && (
            <div className="flex-1 border rounded overflow-hidden" style={{ borderColor: 'var(--ant-color-border)' }}>
              <div className="text-xs px-2 py-1 border-b" style={{ borderColor: 'var(--ant-color-border)' }}>
                压缩后 ({formatBytes(compressedSize)}) — 减少 {((1 - compressedSize / file.size) * 100).toFixed(1)}%
              </div>
              <img src={preview} className="max-w-full max-h-full object-contain" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
