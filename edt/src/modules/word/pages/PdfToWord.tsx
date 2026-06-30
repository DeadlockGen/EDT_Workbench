import { useState, useCallback } from 'react'
import { Button, message, Tag } from 'antd'
import { FilePdfOutlined } from '@ant-design/icons'
import { Document, Packer, Paragraph, TextRun } from 'docx'

/**
 * Clean and validate text for safe OOXML insertion.
 * Removes control chars, trims excess whitespace, limits length.
 */
function sanitizeText(text: string): string {
  return text
    // Remove null bytes and control characters except \t \n \r
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Collapse multiple whitespace into single space
    .replace(/[ \t]+/g, ' ')
    // Remove leading/trailing whitespace per line
    .replace(/^[ \t]+|[ \t]+$/gm, '')
    .trim()
}

/**
 * Check if a line is meaningful content (not symbols, not too short, not numeric garbage).
 */
function isMeaningfulLine(text: string): boolean {
  if (text.length < 2) return false
  // Pure symbols/punctuation only
  if (/^[\s\-•·*#_=@$%^&+=\/\\<>~`|:;,!?。，、；：？！…—·'"{}[\]()]+$/.test(text)) return false
  // Pure numbers
  if (/^[\d\s.,]+$/.test(text)) return false
  // PDF garbage: single chars repeated (like "TTTTTTT" or "fffffff")
  if (text.length > 3 && /^(.)\1{3,}$/.test(text)) return false
  return true
}

/**
 * Extract text from PDF using binary stream analysis.
 * Handles multi-byte UTF-16 and common PDF encoding schemes.
 */
async function extractPdfText(file: File): Promise<string> {
  const buf = await file.arrayBuffer()
  const bytes = new Uint8Array(buf)

  // Strategy 1: Extract text from PDF content streams (Tj/TJ operators)
  const raw = new TextDecoder('utf-8', { fatal: false }).decode(bytes)
  const seen = new Set<string>()
  const result: string[] = []

  // Extract parenthesized strings from PDF content (Tj operator)
  const parenMatches = raw.match(/\(([\s\S]*?)\)\s*Tj/gi) || []
  for (const m of parenMatches) {
    const content = m.replace(/^\(/, '').replace(/\)\s*Tj$/i, '')
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\([\\()nrt])/g, '$1')
      .replace(/\\([0-7]{3})/g, (_, o) => String.fromCharCode(parseInt(o, 8)))
      .replace(/\\(x|X)([0-9a-fA-F]{2})/g, (_, __, h) => String.fromCharCode(parseInt(h, 16)))
    const cleaned = sanitizeText(content)
    if (cleaned && isMeaningfulLine(cleaned) && !seen.has(cleaned)) {
      seen.add(cleaned)
      result.push(cleaned)
    }
  }

  // Strategy 2: TJ operator arrays (hex strings)
  const tjMatches = raw.match(/\(([\s\S]*?)\)\s*TJ/gi) || []
  for (const m of tjMatches) {
    const content = m.replace(/^\(/, '').replace(/\)\s*TJ$/i, '')
      .replace(/\\\d{3}/g, '')
      .replace(/\\[\\()nrt]/g, ' ')
    const cleaned = sanitizeText(content)
    if (cleaned && isMeaningfulLine(cleaned) && cleaned.length > 3 && !seen.has(cleaned)) {
      seen.add(cleaned)
      result.push(cleaned)
    }
  }

  // Strategy 3: UTF-16 BE text in PDF (common for CJK PDFs)
  let utf16Result = ''
  for (let i = 0; i < bytes.length - 1; i += 2) {
    if (bytes[i] === 0xFE && bytes[i + 1] === 0xFF) { continue } // BOM skip
    const hi = bytes[i]
    const lo = bytes[i + 1]
    if (hi === 0 && lo >= 0x20 && lo <= 0x7E) {
      utf16Result += String.fromCharCode(lo)
    } else if (hi >= 0x4E && hi <= 0x9F) {
      // CJK Unified Ideographs range
      utf16Result += String.fromCodePoint((hi << 8) | lo)
    } else if (hi > 0 && lo > 0) {
      utf16Result += String.fromCodePoint((hi << 8) | lo)
    } else {
      utf16Result += '\n'
    }
  }
  const utf16Lines = utf16Result.split('\n')
    .map(sanitizeText)
    .filter(l => l.length > 4 && isMeaningfulLine(l) && !seen.has(l))
  for (const l of utf16Lines) {
    seen.add(l)
    result.push(l)
  }

  // Strategy 4: Raw readable text fallback (last resort)
  const readableFallback = raw.match(/[一-鿿一-鿿\w\s.,!?;:()@#$%+=/\\<>~|-]{8,}/g) || []
  for (const m of readableFallback) {
    const cleaned = sanitizeText(m)
    if (cleaned && isMeaningfulLine(cleaned) && !seen.has(cleaned)) {
      seen.add(cleaned)
      result.push(cleaned)
    }
  }

  return result.join('\n')
}

async function createDocxBlob(text: string): Promise<Blob> {
  // Split into lines, clean each, filter empty/garbage
  const rawLines = text.split('\n')
  const cleanedLines: string[] = []

  for (const line of rawLines) {
    const cleaned = sanitizeText(line)
    if (!cleaned) continue
    if (!isMeaningfulLine(cleaned)) continue
    // Deduplicate adjacent identical lines
    if (cleanedLines.length > 0 && cleanedLines[cleanedLines.length - 1] === cleaned) continue
    cleanedLines.push(cleaned)
  }

  // Fallback if nothing extracted
  if (cleanedLines.length === 0) {
    cleanedLines.push('（未能从 PDF 中提取到可显示的文本内容）')
  }

  const paragraphs = cleanedLines.map(line => {
    const isShortHeading = line.length < 50
      && !/[.。!！?？]/.test(line.slice(-1))

    return new Paragraph({
      spacing: { before: isShortHeading ? 200 : 60, after: 100 },
      indent: isShortHeading ? undefined : { firstLine: 480 },
      children: [
        new TextRun({
          text: line,
          size: isShortHeading ? 24 : 21,
          bold: isShortHeading,
          font: 'Microsoft YaHei'
        })
      ]
    })
  })

  const doc = new Document({
    title: 'PDF 转换文档',
    creator: 'EDT',
    styles: {
      default: {
        document: {
          run: { font: 'Microsoft YaHei', size: 21 }
        }
      }
    },
    sections: [{
      properties: {
        page: {
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
        }
      },
      children: paragraphs
    }]
  })

  return await Packer.toBlob(doc)
}

export function PdfToWord() {
  const [file, setFile] = useState<File | null>(null)
  const [converting, setConverting] = useState(false)

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.name.toLowerCase().endsWith('.pdf')) {
      message.warning('请选择 PDF 文件')
      return
    }
    if (f.size > 50 * 1024 * 1024) {
      message.warning('文件超过 50MB 限制')
      return
    }
    setFile(f)
  }, [])

  const handleConvert = useCallback(async () => {
    if (!file) return
    setConverting(true)
    try {
      const text = await extractPdfText(file)
      if (!text.trim()) {
        message.warning('未能从 PDF 中提取到文本内容，该 PDF 可能为扫描件')
        setConverting(false)
        return
      }
      const blob = await createDocxBlob(text)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name.replace(/\.pdf$/i, '.docx')
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 60000)
      message.success(`转换完成，已提取 ${text.split('\n').filter(l => l.trim()).length} 段文本`)
    } catch (e) {
      message.error('转换失败: ' + (e as Error).message)
    }
    setConverting(false)
  }, [file])

  return (
    <div className="h-full flex flex-col items-center justify-center gap-4" style={{ padding: 40 }}>
      <FilePdfOutlined style={{ fontSize: 48, color: 'var(--ant-color-primary)' }} />
      <div className="text-sm font-medium">PDF 转 Word</div>
      <div className="text-xs" style={{ color: 'var(--ant-color-text-description)' }}>选择 PDF 文件并转换为 Word 格式</div>
      <div className="flex items-center gap-1.5">
        <Tag color="orange">实验性功能</Tag>
        <span className="text-2xs" style={{ color: 'var(--ant-color-text-quaternary)' }}>部分格式的 PDF 转换效果可能不理想</span>
      </div>
      <input type="file" accept=".pdf" onChange={handleFile} className="text-xs" />
      {file && (
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs" style={{ color: 'var(--ant-color-text-secondary)' }}>已选择: {file.name}</div>
          <Button type="primary" size="small" onClick={handleConvert} loading={converting}>
            转换为 Word
          </Button>
        </div>
      )}
    </div>
  )
}
