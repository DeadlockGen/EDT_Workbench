import { ModuleTabs, type TabItem } from '@/components/common/ModuleTabs'
import { CsvExcelConvert } from './pages/CsvExcelConvert'
import { ExcelToJson } from './pages/ExcelToJson'
import { ExcelToSql } from './pages/ExcelToSql'
import { ExcelToMarkdown } from './pages/ExcelToMarkdown'
import { ExcelToHtml } from './pages/ExcelToHtml'

const tabs: TabItem[] = [
  { key: 'csv', label: 'CSV ↔ Excel', content: <CsvExcelConvert /> },
  { key: 'json', label: 'Excel → JSON', content: <ExcelToJson /> },
  { key: 'sql', label: 'Excel → SQL', content: <ExcelToSql /> },
  { key: 'md', label: 'Markdown', content: <ExcelToMarkdown /> },
  { key: 'html', label: 'HTML', content: <ExcelToHtml /> }
]

export default function ExcelWorkspace() {
  return <ModuleTabs module="/excel" tabs={tabs} defaultTab="csv" />
}
