import { useState, useCallback } from 'react'
import { Button } from 'antd'
import { PageHeader } from '@/components/common/PageHeader'
import { FormatEditor } from '@/components/editor/MonacoEditor'

export function SvgViewer() {
  const [svgCode, setSvgCode] = useState('<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">\n  <circle cx="100" cy="100" r="80" fill="#1677ff" />\n  <text x="100" y="110" text-anchor="middle" fill="white" font-size="20">SVG</text>\n</svg>')
  const [url, setUrl] = useState('')

  const handleRender = useCallback(() => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' })
    setUrl(URL.createObjectURL(blob))
  }, [svgCode])

  return (
    <div className="h-full flex flex-col gap-3">
      <PageHeader title="SVG 查看" subtitle="编辑并预览 SVG" />
      <div className="flex gap-3 min-h-0 flex-1">
        <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
          <FormatEditor value={svgCode} onChange={setSvgCode} language="xml" />
        </div>
        <div className="flex-1 border rounded flex items-center justify-center p-3" style={{ borderColor: 'var(--ant-color-border)' }}>
          {url ? <img src={url} className="max-w-full max-h-full" /> : <span className="text-xs" style={{ color: 'var(--ant-color-text-description)' }}>点击渲染查看 SVG</span>}
        </div>
      </div>
      <Button type="primary" size="small" className="self-start" onClick={handleRender}>渲染</Button>
    </div>
  )
}
