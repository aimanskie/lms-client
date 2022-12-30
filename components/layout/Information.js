import { Alert } from 'antd'

const Info = ({ message, desc }) => {
  return <Alert message={message} description={desc} type='info' showIcon />
}

export default Info
