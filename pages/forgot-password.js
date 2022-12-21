import { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { SyncOutlined } from '@ant-design/icons'
import { Context } from '../context'
import { useRouter } from 'next/router'
import { Form, Input, Space, Button } from 'antd'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const {
    state: { user },
  } = useContext(Context)

  const router = useRouter()
  const [form] = Form.useForm()

  useEffect(() => {
    if (user !== null) router.push('/')
  }, [user])

  const handleSubmit = async ({ user }) => {
    const { email } = user
    try {
      const { data } = await axios.post('/api/forgot-password', { email })
      setSuccess(true)
      toast.success('Check your email for the secret code')
    } catch (err) {
      toast.error(err.response.data)
    }
  }

  const handleResetPassword = async ({ user }) => {
    const { email, code, newPassword } = user
    try {
      const { data } = await axios.post('/api/reset-password', {
        email,
        code,
        newPassword,
      })
      toast.success('Great! Now you can login with your new password')
      form.resetFields()
      router.push('/login')
    } catch (err) {
      toast.error(err.response.data)
    }
  }

  return (
    <>
      <h1 className='jumbotron text-center bg-primary square'>Forgot Password</h1>
      <Space direction='vertical' align='center'>
        <Form form={form} name='nest-messages' onFinish={success ? handleResetPassword : handleSubmit}>
          <Form.Item name={['user', 'email']} label='Email'>
            <Input />
          </Form.Item>
          {success && (
            <>
              <Form.Item name={['user', 'code']} label='Secret Code'>
                <Input />
              </Form.Item>
              <Form.Item name={['user', 'newPassword']} label='New Password'>
                <Input.Password />
              </Form.Item>
            </>
          )}
          <Form.Item>
            <Button type='primary' htmlType='submit' block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Space>

      {/* <div className='container col-md-4 offset-md-4 pb-5'>
        <form onSubmit={success ? handleResetPassword : handleSubmit}>
          <input
            type='email'
            className='form-control mb-4 p-4'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter email'
            required
          />
          {success && (
            <>
              <input
                type='text'
                className='form-control mb-4 p-4'
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder='Enter secret code'
                required
              />

              <input
                type='password'
                className='form-control mb-4 p-4'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder='New Password'
                required
              />
            </>
          )}

          <button type='submit' className='btn btn-primary btn-block p-2' disabled={loading || !email}>
            {loading ? <SyncOutlined spin /> : 'Submit'}
          </button>
        </form>
      </div> */}
    </>
  )
}

export default ForgotPassword
