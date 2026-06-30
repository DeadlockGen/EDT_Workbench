export const EDITOR_LANGUAGES = [
  { id: 'json', label: 'JSON' },
  { id: 'xml', label: 'XML' },
  { id: 'yaml', label: 'YAML' },
  { id: 'sql', label: 'SQL' },
  { id: 'ini', label: 'INI' },
  { id: 'properties', label: 'Properties' },
  { id: 'nginx', label: 'Nginx' },
  { id: 'dockerfile', label: 'Dockerfile' },
  { id: 'shell', label: 'Shell' },
  { id: 'powershell', label: 'PowerShell' },
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'markdown', label: 'Markdown' },
  { id: 'csv', label: 'CSV' },
  { id: 'plaintext', label: 'Plain Text' }
]

export const EDITOR_THEME = {
  light: 'vs',
  dark: 'vs-dark'
}

export const EDITOR_OPTIONS: Record<string, unknown> = {
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  scrollbar: {
    vertical: 'visible',
    horizontal: 'hidden',
    verticalScrollbarSize: 10,
    alwaysConsumeMouseWheel: false
  },
  fontSize: 14,
  tabSize: 2,
  wordWrap: 'on',
  wordWrapColumn: 120,
  wrappingStrategy: 'advanced',
  wrappingIndent: 'indent',
  lineNumbers: 'on',
  renderWhitespace: 'selection',
  bracketPairColorization: { enabled: true },
  padding: { top: 8 },
  automaticLayout: true,
  overviewRulerBorder: false,
  hideCursorInOverviewRuler: true
}
