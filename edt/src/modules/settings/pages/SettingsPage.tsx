import { useState } from 'react'
import { Card, Switch, Select, InputNumber, Button, Divider, message } from 'antd'
import { useAppStore } from '@/stores/app.store'

export function SettingsPage() {
  const { theme, setTheme } = useAppStore()
  const [fontSize, setFontSize] = useState(14)
  const [tabSize, setTabSize] = useState(2)
  const [wordWrap, setWordWrap] = useState<'on' | 'off'>('on')
  const [minimap, setMinimap] = useState(true)

  const handleReset = () => {
    setFontSize(14)
    setTabSize(2)
    setWordWrap('on')
    setMinimap(true)
    message.success('设置已重置为默认值')
  }

  return (
    <div className="max-w-2xl flex flex-col gap-4 p-4">
      <Card size="small" title="外观">
        <div className="flex items-center justify-between py-2">
          <span className="text-xs">主题模式</span>
          <Select size="small" value={theme} onChange={setTheme} style={{ width: 100 }}
            options={[
              { value: 'light', label: '浅色模式' },
              { value: 'dark', label: '深色模式' }
            ]} />
        </div>
      </Card>

      <Card size="small" title="编辑器">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs">字号</span>
            <InputNumber size="small" value={fontSize} onChange={v => setFontSize(v || 14)} min={10} max={32} style={{ width: 80 }} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs">Tab 缩进</span>
            <Select size="small" value={tabSize} onChange={setTabSize} style={{ width: 80 }}
              options={[{ value: 2, label: '2 空格' }, { value: 4, label: '4 空格' }, { value: 8, label: '8 空格' }]} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs">自动换行</span>
            <Switch size="small" checked={wordWrap === 'on'} onChange={v => setWordWrap(v ? 'on' : 'off')} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs">显示缩略图</span>
            <Switch size="small" checked={minimap} onChange={setMinimap} />
          </div>
        </div>
      </Card>

      <Card size="small" title="数据">
        <div className="flex items-center justify-between py-2">
          <span className="text-xs">数据库位置</span>
          <span className="text-xs" style={{ color: 'var(--ant-color-text-description)' }}>%APPDATA%/edt/edt.db</span>
        </div>
      </Card>

      <Divider />
      <Button size="small" onClick={handleReset}>恢复默认设置</Button>
    </div>
  )
}

export function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 select-none">
      <div className="text-5xl font-light tracking-widest" style={{ color: 'var(--ant-color-primary)' }}>EDT</div>
      <div className="text-sm font-medium">Enterprise Deployment Toolkit</div>
      <div className="text-xs" style={{ color: 'var(--ant-color-text-description)' }}>版本 0.1.0</div>
      <div className="text-xs max-w-md text-center mt-4 leading-relaxed" style={{ color: 'var(--ant-color-text-secondary)' }}>
        面向企业软件实施工程师、运维工程师和项目交付人员的 Windows 桌面工具箱。
        所有功能均支持离线运行，适用于企业内网及涉密环境。
      </div>
      <div className="text-2xs mt-8" style={{ color: 'var(--ant-color-text-quaternary)' }}>
        Built with Electron + React + TypeScript
      </div>
    </div>
  )
}
