import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Context } from '../../context'
import { useRouter } from 'next/router'
import { Button, Form, Input, Space, Typography } from 'antd'
const { Link } = Typography

const newInstructor = () => {
  const [bankAccount, setBankAccount] = useState('')
  const [bank, setBank] = useState('')

  const {
    state: { user },
    dispatch,
  } = useContext(Context)

  const router = useRouter()
  const [form] = Form.useForm()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(`/api/make-instructor`, {
        bankAccount,
        bank,
      })
      dispatch({
        type: 'LOGIN',
        payload: data,
      })
      toast.success('Registration Instructor successful')
      setBankAccount('')
      setBank('')
      router.push('/instructor')
    } catch (err) {
      toast.error(err.response.data)
    }
  }

  return (
    <>
      <h1 className='jumbotron text-center bg-primary square'>Become Instructor</h1>

      {/* <div className='container col-md-4 offset-md-4 pb-5'> */}
      {/* <form onSubmit={handleSubmit}>
          <input
            type='text'
            className='form-control mb-4 p-4'
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            placeholder='Bank  Name'
            required
          />

          <input
            type='number'
            className='form-control mb-4 p-4'
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            placeholder='Enter Bank Account Number'
            required
          />

          <button type='submit' className='btn btn-block btn-primary' disabled={!bank || !bankAccount}>
            Submit
          </button>
        </form> */}
      <Space direction='vertical' align='center'>
        <Form form={form} name='nest-messages' onFinish={handleSubmit}>
          <Form.Item name={['user', 'bank']} label='Nama Bank untuk transfer sales'>
            <Input />
          </Form.Item>
          <Form.Item name={['user', 'bankAaccount']} label='Bank Account'>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' block>
              Submit
            </Button>
          </Form.Item>
        </Form>
        {/* <Link href='/register'>New user</Link> */}
        {/* <Link href='/forgot-password'>Forgot password</Link> */}
      </Space>
      {/* </div>rd
       */}
    </>
  )
}

export default newInstructor
