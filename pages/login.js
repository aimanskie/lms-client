import { useContext, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Context } from '../context'
import { useRouter } from 'next/router'
import { Button, Form, Input, Space, Typography } from 'antd'
const { Link } = Typography

const Login = () => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  }

  const {
    state: { user },
    dispatch,
  } = useContext(Context)

  const router = useRouter()
  const [form] = Form.useForm()

  useEffect(() => {
    if (user !== null) router.push('/')
  }, [user])

  const handleSubmit = async ({ user }) => {
    try {
      const { email, password } = user
      const { data } = await axios.post(`/api/login`, {
        email,
        password,
      })
      dispatch({
        type: 'LOGIN',
        payload: data,
      })
      const dataUser = {
        courses: data.courses,
        name: data.name,
        role: data.role,
        _id: data._id,
      }
      window.localStorage.setItem('user', JSON.stringify(dataUser))
      form.resetFields()
      router.push('/user')
    } catch (err) {
      toast(err.response.data)
    }
  }

  return (
    <>
      <h1 className='jumbotron text-center bg-primary square'>Login</h1>
      <Space direction='vertical' align='center'>
        <Form form={form} name='nest-messages' onFinish={handleSubmit}>
          <Form.Item name={['user', 'email']} label='Email'>
            <Input />
          </Form.Item>
          <Form.Item name={['user', 'password']} label='Password'>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' block>
              Submit
            </Button>
          </Form.Item>
        </Form>
        <Link href='/register'>New user</Link>
        <Link href='/forgot-password'>Forgot password</Link>
      </Space>
    </>
  )
}

export default Login
