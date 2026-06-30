import { useState, useCallback } from 'react'
import { Select, Space, Input } from 'antd'
import CryptoJS from 'crypto-js'
import { PageHeader } from '@/components/common/PageHeader'
import { FormatEditor } from '@/components/editor/MonacoEditor'
import { ResultPanel } from '@/components/common/ResultPanel'

export default function HmacPage() {
  const [input, setInput] = useState('')
  const [secret, setSecret] = useState('')
  const [result, setResult] = useState('')
  const [algorithm, setAlgorithm] = useState<'md5' | 'sha1' | 'sha256' | 'sha512'>('sha256')

  const handleCompute = useCallback(() => {
    if (!input.trim()) return
    const hmac = CryptoJS.HmacSHA256(input, secret || '')
    if (algorithm === 'md5') {
      setResult(CryptoJS.HmacMD5(input, secret || '').toString())
    } else if (algorithm === 'sha1') {
      setResult(CryptoJS.HmacSHA1(input, secret || '').toString())
    } else if (algorithm === 'sha256') {
      setResult(hmac.toString())
    } else {
      setResult(CryptoJS.HmacSHA512(input, secret || '').toString())
    }
  }, [input, secret, algorithm])

  return (
    <div className="h-full flex flex-col">
      <PageHeader title="HMAC" subtitle="基于密钥的哈希消息认证码" extra={
        <Space>
          <Select size="small" value={algorithm} onChange={setAlgorithm} style={{ width: 100 }}
            options={[
              { value: 'md5', label: 'MD5' },
              { value: 'sha1', label: 'SHA1' },
              { value: 'sha256', label: 'SHA256' },
              { value: 'sha512', label: 'SHA512' }
            ]} />
        </Space>
      } />
      <div className="flex-1 flex flex-col gap-3 min-h-0">
        <div className="flex items-center gap-2">
          <span className="text-xs">密钥:</span>
          <Input.Search size="small" value={secret} onChange={e => setSecret(e.target.value)}
            placeholder="输入密钥" className="max-w-xs" enterButton="计算" onSearch={handleCompute} />
        </div>
        <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
          <FormatEditor value={input} onChange={setInput} language="plaintext" />
        </div>
        {result && <ResultPanel title="HMAC 结果" content={result} />}
      </div>
    </div>
  )
}
