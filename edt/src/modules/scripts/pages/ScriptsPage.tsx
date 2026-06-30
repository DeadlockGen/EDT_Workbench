import { PageHeader } from '@/components/common/PageHeader'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { EmptyState } from '@/components/common/EmptyState'

export default function ScriptsPage() {
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader
        title="脚本中心"
        subtitle="管理企业实施过程中常用的 Shell / PowerShell / CMD / SQL / Python 脚本"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/scripts/new')}>
            新建脚本
          </Button>
        }
      />
      <EmptyState title="暂无脚本" description={'点击"新建脚本"或从左侧导航进入编辑器'} />
    </div>
  )
}
