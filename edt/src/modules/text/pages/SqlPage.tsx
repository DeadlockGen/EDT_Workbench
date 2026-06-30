import { useState, useCallback } from 'react'
import { Button, Select, Space } from 'antd'
import { FormatPainterOutlined, ClearOutlined } from '@ant-design/icons'
import { format as sqlFormat } from 'sql-formatter'
import { PageHeader } from '@/components/common/PageHeader'
import { SplitPanel } from '@/components/layout/SplitPanel'
import { FormatEditor } from '@/components/editor/MonacoEditor'

const dialectOptions = [
  { value: 'mysql', label: 'MySQL' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'mariadb', label: 'MariaDB' },
  { value: 'mssql', label: 'SQL Server' },
  { value: 'db2', label: 'DB2' },
  { value: 'plsql', label: 'Oracle PL/SQL' },
  { value: 'sqlite', label: 'SQLite' },
  { value: 'n1ql', label: 'N1QL' },
  { value: 'bigquery', label: 'BigQuery' },
  { value: 'redshift', label: 'Redshift' },
  { value: 'spark', label: 'Spark' },
  { value: 'tsql', label: 'TSQL' }
]

export default function SqlPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [dialect, setDialect] = useState('mysql')
  const [statusText, setStatusText] = useState('')

  const handleFormat = useCallback(() => {
    if (!input.trim()) {
      setStatusText('请输入 SQL 语句')
      return
    }
    try {
      const result = sqlFormat(input, {
        language: dialect as any,
        tabWidth: 2,
        linesBetweenQueries: 2
      })
      setOutput(result)
      setStatusText('')
    } catch (e) {
      setOutput('')
      setStatusText('格式化失败: ' + (e as Error).message)
    }
  }, [input, dialect])

  const handleClear = useCallback(() => {
    setInput('')
    setOutput('')
    setStatusText('')
  }, [])

  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="SQL 格式化/美化"
        subtitle="支持 MySQL / PostgreSQL / Oracle / SQL Server 等多种方言"
        extra={
          <Space>
            <Select
              size="small"
              value={dialect}
              onChange={setDialect}
              style={{ width: 140 }}
              options={dialectOptions}
            />
            <Button size="small" icon={<ClearOutlined />} onClick={handleClear}>清空</Button>
          </Space>
        }
      />
      <div className="flex-1 min-h-0">
        <SplitPanel
          left={
            <div className="h-full flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Button type="primary" size="small" icon={<FormatPainterOutlined />} onClick={handleFormat}>
                  格式化
                </Button>
                {statusText && (
                  <span className="text-xs text-red-500">{statusText}</span>
                )}
              </div>
              <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
                <FormatEditor value={input} onChange={setInput} language="sql" />
              </div>
            </div>
          }
          right={
            <div className="h-full flex flex-col">
              <div className="flex-1 border rounded" style={{ borderColor: 'var(--ant-color-border)' }}>
                {output ? (
                  <FormatEditor value={output} language="sql" readOnly />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs" style={{ color: 'var(--ant-color-text-description)' }}>
                    格式化后的 SQL 将在此显示
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
