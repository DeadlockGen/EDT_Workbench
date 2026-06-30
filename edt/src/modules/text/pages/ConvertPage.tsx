import { useState, useCallback } from 'react'
import { Button, Select, Space, message } from 'antd'
import { SwapOutlined, ClearOutlined } from '@ant-design/icons'
import { PageHeader } from '@/components/common/PageHeader'
import { SplitPanel } from '@/components/layout/SplitPanel'
import { FormatEditor } from '@/components/editor/MonacoEditor'
import { jsonToYaml, yamlToJson, jsonToXml, xmlToJson } from '../utils/converters'
import Papa from 'papaparse'

type ConvertMode =
  | 'json2yaml'
  | 'yaml2json'
  | 'json2xml'
  | 'xml2json'
  | 'csv2json'
  | 'json2csv'

const convertModes: { value: ConvertMode; label: string; srcLang: string; dstLang: string }[] = [
  { value: 'json2yaml', label: 'JSON → YAML', srcLang: 'json', dstLang: 'yaml' },
  { value: 'yaml2json', label: 'YAML → JSON', srcLang: 'yaml', dstLang: 'json' },
  { value: 'json2xml', label: 'JSON → XML', srcLang: 'json', dstLang: 'xml' },
  { value: 'xml2json', label: 'XML → JSON', srcLang: 'xml', dstLang: 'json' },
  { value: 'csv2json', label: 'CSV → JSON', srcLang: 'csv', dstLang: 'json' },
  { value: 'json2csv', label: 'JSON → CSV', srcLang: 'json', dstLang: 'csv' }
]

function doConvert(input: string, mode: ConvertMode): string {
  switch (mode) {
    case 'json2yaml':
      return jsonToYaml(input)
    case 'yaml2json':
      return yamlToJson(input)
    case 'json2xml':
      return jsonToXml(input)
    case 'xml2json':
      return xmlToJson(input)
    case 'csv2json': {
      const result = Papa.parse(input, { header: true, skipEmptyLines: true })
      return JSON.stringify(result.data, null, 2)
    }
    case 'json2csv': {
      const data = JSON.parse(input)
      if (!Array.isArray(data)) throw new Error('JSON 必须是数组格式')
      return Papa.unparse(data)
    }
    default:
      throw new Error('不支持的转换类型')
  }
}

export default function ConvertPage() {
  const [mode, setMode] = useState<ConvertMode>('json2yaml')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const currentMode = convertModes.find((m) => m.value === mode)!

  const handleConvert = useCallback(() => {
    if (!input.trim()) {
      message.warning('请输入要转换的内容')
      return
    }
    setError('')
    try {
      const result = doConvert(input, mode)
      setOutput(result)
    } catch (e) {
      setError((e as Error).message)
      setOutput('')
    }
  }, [input, mode])

  const handleSwap = useCallback(() => {
    if (output) {
      setInput(output)
      setOutput('')
      setError('')
    }
    // Toggle pairs
    const pair: Record<string, string> = {
      json2yaml: 'yaml2json',
      yaml2json: 'json2yaml',
      json2xml: 'xml2json',
      xml2json: 'json2xml',
      csv2json: 'json2csv',
      json2csv: 'csv2json'
    }
    setMode(pair[mode] as ConvertMode)
  }, [mode, output])

  const handleClear = useCallback(() => {
    setInput('')
    setOutput('')
    setError('')
  }, [])

  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="格式互转"
        subtitle="JSON ↔ YAML ↔ XML ↔ CSV"
        extra={
          <Space>
            <Select
              size="small"
              value={mode}
              onChange={setMode}
              style={{ width: 150 }}
              options={convertModes}
            />
            <Button size="small" icon={<ClearOutlined />} onClick={handleClear}>清空</Button>
          </Space>
        }
      />
      <div className="flex-1 min-h-0">
        <SplitPanel
          left={
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium">{currentMode.label.split('→')[0].trim()}</span>
                <Space>
                  <Button type="primary" size="small" icon={<SwapOutlined />} onClick={handleConvert}>转换</Button>
                  <Button size="small" onClick={handleSwap}>⇄ 互换</Button>
                </Space>
              </div>
              <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
                <FormatEditor value={input} onChange={setInput} language={currentMode.srcLang} />
              </div>
            </div>
          }
          right={
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium">{currentMode.label.split('→')[1].trim()}</span>
              </div>
              {error && (
                <div className="text-xs px-3 py-1.5 mb-2 rounded bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  {error}
                </div>
              )}
              <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
                {output ? (
                  <FormatEditor value={output} language={currentMode.dstLang} readOnly />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs" style={{ color: 'var(--ant-color-text-description)' }}>
                    转换结果将在此显示
                  </div>
                )}
              </div>
            </div>
          }
        />
      </div>
    </div>
  )
}
