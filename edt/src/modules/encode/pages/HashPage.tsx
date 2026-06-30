import { useState } from 'react'
import { Button } from 'antd'
import CryptoJS from 'crypto-js'
import { PageHeader } from '@/components/common/PageHeader'
import { FormatEditor } from '@/components/editor/MonacoEditor'
import { ResultPanel } from '@/components/common/ResultPanel'

export default function HashPage() {
  const [input, setInput] = useState('')
  const [results, setResults] = useState<Record<string, string>>({})

  const handleCompute = () => {
    if (!input.trim()) return
    setResults({
      MD5: CryptoJS.MD5(input).toString(),
      SHA1: CryptoJS.SHA1(input).toString(),
      SHA256: CryptoJS.SHA256(input).toString(),
      SHA512: CryptoJS.SHA512(input).toString()
    })
  }

  return (
    <div className="h-full flex flex-col gap-3">
      <PageHeader title="Hash 计算" subtitle="MD5 / SHA1 / SHA256 / SHA512" />
      <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
        <FormatEditor value={input} onChange={setInput} language="plaintext" />
      </div>
      <Button type="primary" size="small" className="self-start" onClick={handleCompute}>计算 Hash</Button>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(results).map(([name, hash]) => (
          <ResultPanel key={name} title={name} content={hash} />
        ))}
      </div>
    </div>
  )
}
