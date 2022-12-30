import { Button } from 'antd'
import { useRouter } from 'next/router'
import { StepBackwardOutlined } from '@ant-design/icons'

const Back = () => {
  const router = useRouter()

  return <Button onClick={() => router.back()} icon={<StepBackwardOutlined />}></Button>
}

export default Back
