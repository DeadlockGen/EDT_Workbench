import { ModuleTabs, type TabItem } from '@/components/common/ModuleTabs'
import { WordToPdf } from './pages/WordToPdf'
import { PdfToWord } from './pages/PdfToWord'

const tabs: TabItem[] = [
  { key: 'word2pdf', label: 'Word → PDF', content: <WordToPdf /> },
  { key: 'pdf2word', label: 'PDF → Word', content: <PdfToWord /> }
]

export default function WordWorkspace() {
  return <ModuleTabs module="/word" tabs={tabs} defaultTab="word2pdf" />
}
