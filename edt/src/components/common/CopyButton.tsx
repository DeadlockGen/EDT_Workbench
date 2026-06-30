import { useState } from 'react'
import { Tooltip, message } from 'antd'
import { CopyOutlined, CheckOutlined } from '@ant-design/icons'

interface CopyButtonProps {
  text: string
  size?: 'small' | 'default'
}

export function CopyButton({ text, size = 'small' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      message.success('已复制到剪贴板')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for Electron
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      message.success('已复制到剪贴板')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Tooltip title={copied ? '已复制' : '复制'}>
      <span
        className={`inline-flex items-center cursor-pointer ${
          size === 'small' ? 'text-xs' : 'text-sm'
        } ${copied ? 'text-green-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
        onClick={handleCopy}
      >
        {copied ? <CheckOutlined className="mr-1" /> : <CopyOutlined className="mr-1" />}
        {copied ? '已复制' : '复制'}
      </span>
    </Tooltip>
  )
}
