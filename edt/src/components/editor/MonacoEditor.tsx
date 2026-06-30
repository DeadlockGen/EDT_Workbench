import { useRef, useCallback } from 'react'
import Editor, { DiffEditor, loader, type OnMount } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { useTheme } from '../../hooks/useTheme'
import { EDITOR_LANGUAGES, EDITOR_OPTIONS } from './editor.config'

export { DiffEditor, loader }
export type { OnMount }
export type MonacoEditor = editor.IStandaloneCodeEditor
export type MonacoDiffEditor = editor.IStandaloneDiffEditor

loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
  }
})

interface FormatEditorProps {
  value: string
  onChange?: (value: string) => void
  language?: string
  height?: string | number
  readOnly?: boolean
  options?: Record<string, unknown>
}

export function FormatEditor({
  value,
  onChange,
  language = 'plaintext',
  height = '100%',
  readOnly = false,
  options = {}
}: FormatEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const { themeMode } = useTheme()

  const handleMount: OnMount = useCallback((editor) => {
    editorRef.current = editor
    editor.focus()
  }, [])

  const handleChange = useCallback(
    (val: string | undefined) => {
      if (onChange && val !== undefined) {
        onChange(val)
      }
    },
    [onChange]
  )

  return (
    <Editor
      value={value}
      onChange={handleChange}
      language={language}
      theme={themeMode}
      height={height}
      loading={<div className="flex items-center justify-center h-full text-gray-400 text-sm">加载编辑器...</div>}
      options={{
        ...EDITOR_OPTIONS,
        readOnly,
        scrollBeyondLastLine: false,
        ...options
      }}
      onMount={handleMount}
    />
  )
}

interface DiffEditorPanelProps {
  original: string
  modified: string
  language?: string
  height?: string | number
}

export function DiffEditorPanel({
  original,
  modified,
  language = 'plaintext',
  height = '100%'
}: DiffEditorPanelProps) {
  const { themeMode } = useTheme()

  return (
    <DiffEditor
      original={original}
      modified={modified}
      language={language}
      theme={themeMode}
      height={height}
      options={{
        ...EDITOR_OPTIONS,
        readOnly: true,
        renderSideBySide: true,
        minimap: { enabled: false }
      }}
    />
  )
}

export { EDITOR_LANGUAGES }
