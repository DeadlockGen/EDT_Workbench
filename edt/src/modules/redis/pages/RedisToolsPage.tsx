import { useState } from 'react'
import { Tag, Card, InputNumber, Button } from 'antd'
import { PageHeader } from '@/components/common/PageHeader'
import { CopyButton } from '@/components/common/CopyButton'

function secondsToHuman(secs: number): string {
  if (secs < 0) return '已过期或未设置'
  const units = [
    [31536000, '年'], [2592000, '月'], [86400, '天'],
    [3600, '小时'], [60, '分钟'], [1, '秒']
  ] as const
  const parts: string[] = []
  let remaining = secs
  for (const [div, label] of units) {
    if (remaining >= div) {
      const count = Math.floor(remaining / div)
      parts.push(`${count} ${label}`)
      remaining %= div
    }
  }
  return parts.join(' ') || '0 秒'
}

export function TtlConverter() {
  const [seconds, setSeconds] = useState<number>(3600)
  const [human, setHuman] = useState('')

  return (
    <div className="h-full flex flex-col gap-3">
      <PageHeader title="TTL 时间转换" subtitle="Redis TTL 秒数 ↔ 可读时间" />
      <div className="flex items-center gap-3">
        <InputNumber size="small" value={seconds} onChange={v => setSeconds(v || 0)} style={{ width: 200 }} addonAfter="秒" />
        <Button size="small" onClick={() => setHuman(secondsToHuman(seconds))}>转换</Button>
      </div>
      {human && (
        <Card size="small" className="self-start">
          <div className="flex items-center gap-2">
            <span className="text-lg font-mono">{seconds}</span>
            <span>秒 = </span>
            <span className="text-lg font-medium">{human}</span>
            <CopyButton text={human} />
          </div>
        </Card>
      )}
    </div>
  )
}

export function RedisCommands() {
  const commands = [
    { cmd: 'SET key value', desc: '设置字符串值', group: 'String' },
    { cmd: 'GET key', desc: '获取字符串值', group: 'String' },
    { cmd: 'DEL key [key ...]', desc: '删除键', group: '通用' },
    { cmd: 'EXISTS key [key ...]', desc: '检查键是否存在', group: '通用' },
    { cmd: 'EXPIRE key seconds', desc: '设置过期时间', group: '通用' },
    { cmd: 'TTL key', desc: '查看剩余过期时间', group: '通用' },
    { cmd: 'HSET key field value', desc: '设置 Hash 字段', group: 'Hash' },
    { cmd: 'HGET key field', desc: '获取 Hash 字段', group: 'Hash' },
    { cmd: 'HGETALL key', desc: '获取所有 Hash 字段', group: 'Hash' },
    { cmd: 'LPUSH key value', desc: '从左侧推入列表', group: 'List' },
    { cmd: 'RPUSH key value', desc: '从右侧推入列表', group: 'List' },
    { cmd: 'LPOP key', desc: '从左侧弹出元素', group: 'List' },
    { cmd: 'LLEN key', desc: '获取列表长度', group: 'List' },
    { cmd: 'LRANGE key start stop', desc: '获取列表范围', group: 'List' },
    { cmd: 'SADD key member', desc: '添加集合成员', group: 'Set' },
    { cmd: 'SMEMBERS key', desc: '获取所有集合成员', group: 'Set' },
    { cmd: 'ZADD key score member', desc: '添加有序集合成员', group: 'Sorted Set' },
    { cmd: 'ZRANGE key start stop', desc: '按排名获取成员', group: 'Sorted Set' },
    { cmd: 'KEYS pattern', desc: '查找键（慎用）', group: '通用' },
    { cmd: 'SCAN cursor [MATCH pattern]', desc: '迭代查找键', group: '通用' },
    { cmd: 'INFO [section]', desc: '查看服务器信息', group: '服务器' },
    { cmd: 'CLIENT LIST', desc: '查看客户端连接', group: '服务器' },
    { cmd: 'FLUSHALL', desc: '清空所有数据库', group: '服务器' },
    { cmd: 'SELECT index', desc: '切换数据库', group: '服务器' },
    { cmd: 'PUBLISH channel message', desc: '发布消息', group: 'Pub/Sub' },
    { cmd: 'SUBSCRIBE channel', desc: '订阅频道', group: 'Pub/Sub' }
  ]

  const [filter, setFilter] = useState('')

  return (
    <div className="h-full flex flex-col gap-3 overflow-auto">
      <PageHeader title="Redis 常用命令" />
      <div className="flex gap-2 flex-wrap">
        {['String', 'Hash', 'List', 'Set', 'Sorted Set', 'Pub/Sub', '通用', '服务器'].map(g => (
          <Tag key={g} color={filter === g ? 'blue' : 'default'} onClick={() => setFilter(filter === g ? '' : g)} className="cursor-pointer">{g}</Tag>
        ))}
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--ant-color-border-secondary)' }}>
            <th className="text-left py-2 px-1 w-[35%]">命令</th>
            <th className="text-left py-2 px-1">说明</th>
            <th className="text-center py-2 px-1 w-16">操作</th>
          </tr>
        </thead>
        <tbody>
          {commands.filter(c => !filter || c.group === filter).map(c => (
            <tr key={c.cmd} className="border-b" style={{ borderColor: 'var(--ant-color-border-secondary)' }}>
              <td className="py-1.5 px-1 font-mono text-xs">{c.cmd}</td>
              <td className="py-1.5 px-1 text-xs">{c.desc} <Tag className="text-2xs">{c.group}</Tag></td>
              <td className="py-1.5 px-1 text-center"><CopyButton text={c.cmd} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function DataStructures() {
  const structures = [
    { name: 'String', maxSize: '512 MB', desc: '最基础的类型，可以是字符串、数字或二进制数据', example: 'SET name "Alice"\nGET name\nINCR counter' },
    { name: 'Hash', maxSize: '4B+ fields', desc: '键值对集合，适合存储对象', example: 'HSET user:id:1 name "Alice"\nHGETALL user:id:1' },
    { name: 'List', maxSize: '4B+ elements', desc: '有序字符串列表，基于链表实现', example: 'LPUSH queue task1\nLRANGE queue 0 -1' },
    { name: 'Set', maxSize: '4B+ members', desc: '无序唯一字符串集合', example: 'SADD tags redis\nSMEMBERS tags' },
    { name: 'Sorted Set', maxSize: '4B+ members', desc: '带分数的有序集合，自动排序', example: 'ZADD leaderboard 100 p1\nZRANGE leaderboard 0 -1 WITHSCORES' },
    { name: 'Bitmap', maxSize: '512 MB', desc: '位图操作，适合统计场景', example: 'SETBIT user:signin 0 1\nBITCOUNT user:signin' },
    { name: 'HyperLogLog', maxSize: '12 KB', desc: '基数估算，用于 UV 统计', example: 'PFADD visits ip1 ip2\nPFCOUNT visits' },
    { name: 'Stream', maxSize: '无限制', desc: '日志数据结构，支持消费者组', example: 'XADD mystream * temp 19.8\nXREAD COUNT 1 STREAMS mystream 0' }
  ]

  return (
    <div className="h-full flex flex-col gap-3 overflow-auto">
      <PageHeader title="Redis 数据结构说明" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {structures.map(s => (
          <Card key={s.name} size="small" title={<span className="text-sm">{s.name} <span className="text-2xs font-normal" style={{ color: 'var(--ant-color-text-description)' }}>最大 {s.maxSize}</span></span>}>
            <div className="text-xs mb-2">{s.desc}</div>
            <pre className="text-2xs p-2 rounded bg-gray-50 dark:bg-gray-900 font-mono leading-relaxed whitespace-pre-wrap">{s.example}</pre>
          </Card>
        ))}
      </div>
    </div>
  )
}
