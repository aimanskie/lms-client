import { useContext, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Context } from '../context'
import { useRouter } from 'next/router'
import { Button, Form, Input } from 'antd'

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
        stripeSession: data.stripeSession,
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
      <div className='container col-md-4 offset-md-4 pb-5'></div>
      <Form {...layout} form={form} name='nest-messages' onFinish={handleSubmit}>
        <Form.Item name={['user', 'email']} label='Email'>
          <Input />
        </Form.Item>
        <Form.Item name={['user', 'password']} label='Password'>
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

export default Login
