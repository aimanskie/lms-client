import { useEffect, useContext } from 'react'
import { SyncOutlined } from '@ant-design/icons'
import UserRoute from '../../../components/routes/UserRoute.js'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Context } from '../../../context/index.js'

const StripeSuccess = () => {
  const router = useRouter()
  const { id } = router.query
  const { dispatch } = useContext(Context)

  useEffect(() => {
    if (id) successRequest()
  }, [id])

  const successRequest = async () => {
    try {
      const { data } = await axios.get(`/api/stripe-success/${id}`)
      router.push(`/user/course/${data.course.slug}`)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <UserRoute showNav={false}>
      <div className='row text-center'>
        <div className='col-md-9 pb-5'>
          <div className='d-flex justify-content-center p-5'>
            <SyncOutlined spin className='display-1 text-danger p-5' />
          </div>
        </div>
        <div className='col-md-3'></div>
      </div>
    </UserRoute>
  )
}

export default StripeSuccess
