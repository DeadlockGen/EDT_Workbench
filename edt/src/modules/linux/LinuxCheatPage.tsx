import { useState, useMemo } from 'react'
import { Input, Empty } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { CopyButton } from '@/components/common/CopyButton'
import { linuxCommands } from './data/commands'

interface Props {
  category: string
}

export function LinuxCheatPage({ category }: Props) {
  const [search, setSearch] = useState('')

  const commands = useMemo(() => {
    return linuxCommands.filter((cmd) => cmd.category === category)
  }, [category])

  const filtered = useMemo(() => {
    if (!search.trim()) return commands
    const q = search.toLowerCase()
    return commands.filter(
      (cmd) =>
        cmd.command.toLowerCase().includes(q) ||
        cmd.description.toLowerCase().includes(q) ||
        cmd.tags.some((t) => t.toLowerCase().includes(q))
    )
  }, [commands, search])

  if (commands.length === 0) {
    return (
      <div className="h-full flex flex-col p-3">
        <Input size="small" prefix={<SearchOutlined />} placeholder="搜索命令..." className="mb-3" />
        <Empty description="暂无命令数据" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-3 pb-0">
        <Input
          size="small"
          prefix={<SearchOutlined />}
          placeholder="搜索命令..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
      </div>
      <div className="flex-1 overflow-auto p-3">
        {filtered.length === 0 ? (
          <Empty description="无匹配命令" />
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--ant-color-border-secondary)' }}>
                <th className="text-left py-2 px-1 font-medium w-[35%]">命令</th>
                <th className="text-left py-2 px-1 font-medium">说明</th>
                <th className="text-right py-2 px-1 font-medium w-12">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cmd) => (
                <tr key={cmd.key} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  style={{ borderColor: 'var(--ant-color-border-secondary)' }}>
                  <td className="py-2 px-1">
                    <code className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800"
                      style={{ fontFamily: "'Cascadia Code', 'Fira Code', monospace" }}>
                      {cmd.command}
                    </code>
                  </td>
                  <td className="py-2 px-1">
                    <div>{cmd.description}</div>
                    {cmd.example && (
                      <div className="text-2xs mt-0.5" style={{ color: 'var(--ant-color-text-description)' }}>
                        示例: {cmd.example}
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-1 text-right">
                    <CopyButton text={cmd.command} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
