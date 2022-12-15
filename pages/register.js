import { useEffect, useContext } from 'react'
import { Button, Form, Input, InputNumber } from 'antd'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Context } from '../context'
import { useRouter } from 'next/router'

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
    string: { min: '${label} must be at least 6 characters' },
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
      if (!data.ok) throw Error
      toast('Please check email for confirmation to complete registration')
      form.resetFields()
      router.push('/login')
    } catch (err) {
      toast.error(err.response.data)
    }
  }

  return (
    <>
      <h1 className='jumbotron text-center bg-primary square'>Register</h1>
      <div className='container col-md-4 offset-md-4 pb-5'></div>
      <Form {...layout} form={form} name='nest-messages' onFinish={onFinish} validateMessages={validateMessages}>
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
              pattern: '(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])',
              message: 'Password must have at least one upper case letter, one digit and one special character',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default Register
