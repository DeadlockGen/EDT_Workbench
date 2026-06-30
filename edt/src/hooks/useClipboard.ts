import { useState, useCallback } from 'react'

export function useClipboard() {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text: string) => {
    try {
      if (typeof window !== 'undefined' && (window as any).electronAPI) {
        await (window as any).electronAPI.clipboard.write(text)
      } else {
        await navigator.clipboard.writeText(text)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [])

  return { copy, copied }
}
