import { useState, useCallback } from 'react'
import { Button, Tabs } from 'antd'
import { jwtDecode } from 'jwt-decode'
import { FormatEditor } from '@/components/editor/MonacoEditor'

// Unsigned JWT generation (algorithm = none)
function base64UrlEncode(str: string): string {
  return btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function generateUnsignedJwt(payload: Record<string, unknown>): string {
  const header = { alg: 'none', typ: 'JWT' }
  const headerB64 = base64UrlEncode(JSON.stringify(header))
  const payloadB64 = base64UrlEncode(JSON.stringify(payload))
  return `${headerB64}.${payloadB64}.`
}

export default function JwtPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [header, setHeader] = useState('')
  const [error, setError] = useState('')
  const [tab, setTab] = useState('decode')
  const [genPayload, setGenPayload] = useState(JSON.stringify({ sub: '1234567890', name: 'John Doe', iat: 1516239022 }, null, 2))
  const [genResult, setGenResult] = useState('')

  const handleDecode = useCallback(() => {
    if (!input.trim()) return
    setError('')
    try {
      const decoded = jwtDecode(input)
      setOutput(JSON.stringify(decoded, null, 2))
      const parts = input.split('.')
      if (parts.length === 3) {
        setHeader(JSON.stringify(JSON.parse(atob(parts[0])), null, 2))
      }
    } catch (e) {
      setError('JWT 解析失败: ' + (e as Error).message)
      setOutput(''); setHeader('')
    }
  }, [input])

  const handleGenerate = useCallback(() => {
    try {
      const payload = JSON.parse(genPayload)
      setGenResult(generateUnsignedJwt(payload))
    } catch (e) {
      setGenResult('Payload JSON 格式错误: ' + (e as Error).message)
    }
  }, [genPayload])

  return (
    <div className="h-full flex flex-col" style={{ padding: 12 }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium">JWT 解析与生成</span>
      </div>
      <div className="flex-1 min-h-0 overflow-auto">
        <Tabs size="small" activeKey={tab} onChange={setTab} type="card"
          items={[
            {
              key: 'decode', label: '解析',
              children: (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)', height: 60 }}>
                      <FormatEditor value={input} onChange={setInput} language="plaintext" />
                    </div>
                    <Button type="primary" size="small" onClick={handleDecode}>解析</Button>
                  </div>
                  {error && <div className="text-xs text-red-500">{error}</div>}
                  <div className="grid grid-cols-2 gap-2">
                    {header && (
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium">Header</span>
                        <div className="border rounded h-48" style={{ borderColor: 'var(--ant-color-border)' }}>
                          <FormatEditor value={header} language="json" readOnly />
                        </div>
                      </div>
                    )}
                    {output && (
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium">Payload</span>
                        <div className="border rounded h-48" style={{ borderColor: 'var(--ant-color-border)' }}>
                          <FormatEditor value={output} language="json" readOnly />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            },
            {
              key: 'generate', label: '生成（无签名）',
              children: (
                <div className="flex flex-col gap-2">
                  <span className="text-xs">Payload (JSON):</span>
                  <div className="border rounded" style={{ borderColor: 'var(--ant-color-border)', height: 200 }}>
                    <FormatEditor value={genPayload} onChange={setGenPayload} language="json" />
                  </div>
                  <Button type="primary" size="small" className="self-start" onClick={handleGenerate}>生成 Token</Button>
                  {genResult && (
                    <>
                      <span className="text-xs font-medium mt-2">生成的 JWT:</span>
                      <div className="border rounded" style={{ borderColor: 'var(--ant-color-border)', height: 60 }}>
                        <FormatEditor value={genResult} language="plaintext" readOnly />
                      </div>
                    </>
                  )}
                </div>
              )
            }
          ]}
        />
      </div>
    </div>
  )
}
