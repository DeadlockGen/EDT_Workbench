import { useState, useCallback } from 'react'
import { Button, Input, InputNumber, Select, Space } from 'antd'
import QRCode from 'qrcode'
import { PageHeader } from '@/components/common/PageHeader'

export function QrCodeGen() {
  const [text, setText] = useState('https://example.com')
  const [size, setSize] = useState(256)
  const [errorLevel, setErrorLevel] = useState('M')
  const [dataUrl, setDataUrl] = useState('')

  const handleGenerate = useCallback(async () => {
    if (!text.trim()) return
    try {
      const url = await QRCode.toDataURL(text, {
        width: size,
        margin: 2,
        errorCorrectionLevel: errorLevel as any
      })
      setDataUrl(url)
    } catch (e) {
      console.error(e)
    }
  }, [text, size, errorLevel])

  return (
    <div className="h-full flex flex-col gap-3">
      <PageHeader title="二维码生成" extra={
        <Space>
          <Select size="small" value={errorLevel} onChange={setErrorLevel} style={{ width: 80 }}
            options={[{ value: 'L', label: '低' }, { value: 'M', label: '中' }, { value: 'Q', label: '较高' }, { value: 'H', label: '高' }]} />
          <InputNumber size="small" value={size} onChange={v => setSize(v || 256)} min={128} max={1024} step={64} addonAfter="px" />
        </Space>
      } />
      <div className="flex items-center gap-2">
        <Input size="small" value={text} onChange={e => setText(e.target.value)} placeholder="输入文本或URL" className="max-w-md" onPressEnter={handleGenerate} />
        <Button type="primary" size="small" onClick={handleGenerate}>生成</Button>
      </div>
      {dataUrl && (
        <div className="flex flex-col items-center gap-2">
          <img src={dataUrl} alt="QR Code" />
          <a href={dataUrl} download="qrcode.png" className="text-xs">下载 PNG</a>
        </div>
      )}
    </div>
  )
}

export function QrCodeDecode() {
  const [result, setResult] = useState('')

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    // Basic approach: read as data URL for display
    const reader = new FileReader()
    reader.onload = () => setResult('请使用在线工具或 API 解析二维码:\n' + reader.result)
    reader.readAsDataURL(f)
  }, [])

  return (
    <div className="h-full flex flex-col gap-3">
      <PageHeader title="二维码解析" subtitle="上传二维码图片进行解析" />
      <input type="file" accept="image/*" onChange={handleFile} className="text-xs" />
      {result && <pre className="text-xs p-3 rounded bg-gray-50 dark:bg-gray-900 whitespace-pre-wrap">{result}</pre>}
    </div>
  )
}
