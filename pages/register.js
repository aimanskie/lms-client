import { useEffect, useContext } from 'react'
import { Button, Form, Input, InputNumber, Space, Typography } from 'antd'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Context } from '../context'
import { useRouter } from 'next/router'
const { Link } = Typography

const Register = () => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  }

  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
    },
    string: { min: 'Minimum 6 characters' },
  }

  const [form] = Form.useForm()

  const {
    state: { user },
  } = useContext(Context)
  const router = useRouter()

  useEffect(() => {
    if (user !== null) router.push('/')
  }, [user])

  const onFinish = async ({ user }) => {
    try {
      const { name, email, password } = user
      const { data } = await axios.post(`/api/register`, {
        name,
        email,
        password,
      })
      // const {token} = data
      // await axios(`api/register?${token}`)
      // if(data.token)
      if (!data.ok) throw Error
      toast('Please check email for confirmation to complete registration')
      form.resetFields()
      // router.push('/login')
    } catch (err) {
      toast.error(err.response.data)
    }
  }

  return (
    <>
      <h1 className='jumbotron text-center bg-primary square'>Register</h1>
      <Space direction='vertical' align='center'>
        <Form form={form} name='nest-messages' onFinish={onFinish} validateMessages={validateMessages}>
          <Form.Item name={['user', 'name']} label='Name' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name={['user', 'email']} label='Email' rules={[{ type: 'email', required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name={['user', 'password']}
            label='Password'
            rules={[
              { required: true, min: 6 },
              {
                pattern: '(?=.*?[A-Z])',
                message: `One Upper Case`,
              },
              {
                pattern: '(?=.*?[0-9])',
                message: `One digit`,
              },
              {
                pattern: '(?=.*?[#?!@$%^&*-])',
                message: `One special character`,
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' block>
              Submit
            </Button>
          </Form.Item>
        </Form>
        <Link href='/login'>Already a user</Link>
      </Space>
    </>
  )
}

export default Register
