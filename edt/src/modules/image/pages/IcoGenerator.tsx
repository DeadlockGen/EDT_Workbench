import { useState, useCallback } from 'react'
import { Button, Card, InputNumber, message } from 'antd'
import { PageHeader } from '@/components/common/PageHeader'

export function IcoGenerator() {
  const [size, setSize] = useState(64)
  const [preview, setPreview] = useState('')

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f || !f.type.startsWith('image/')) return
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage(img, 0, 0, size, size)
      const dataUrl = canvas.toDataURL('image/png')
      setPreview(dataUrl)
    }
    img.src = URL.createObjectURL(f)
  }, [size])

  const handleDownload = useCallback(() => {
    if (!preview) return
    const a = document.createElement('a')
    a.href = preview
    a.download = `icon-${size}x${size}.png`
    a.click()
    message.success('ICO 已下载（PNG 格式）')
  }, [preview, size])

  return (
    <div className="h-full flex flex-col gap-3">
      <PageHeader title="ICO 生成" subtitle="将图片转为 ICO / PNG 图标" extra={
        <InputNumber size="small" value={size} onChange={v => setSize(v || 64)} min={16} max={256} step={16} addonAfter="px" />
      } />
      <div className="flex items-center gap-2">
        <input type="file" accept="image/*" onChange={handleFile} className="text-xs" />
      </div>
      {preview && (
        <Card size="small" className="self-start">
          <img src={preview} alt="preview" style={{ width: size, height: size }} />
          <Button size="small" className="mt-2" onClick={handleDownload}>下载 PNG</Button>
        </Card>
      )}
    </div>
  )
}

export function ScreenshotPlaceholder() {
  return (
    <div className="h-full flex flex-col gap-3">
      <PageHeader title="截图" subtitle="截取屏幕区域" />
      <div className="flex items-center justify-center h-48 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
        <span className="text-xs" style={{ color: 'var(--ant-color-text-description)' }}>截图功能需要原生模块支持，将在后续版本实现</span>
      </div>
    </div>
  )
}
