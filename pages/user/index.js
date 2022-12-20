import { useEffect, useState } from 'react'
import UserRoute from '../../components/routes/UserRoute.js'
import axios from 'axios'
import { Avatar } from 'antd'
import Link from 'next/link'
import { SyncOutlined, PlayCircleOutlined } from '@ant-design/icons'

const UserIndex = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    axios('/api/user-courses')
      .then((res) => {
        setCourses(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }, [])

  return (
    <>
      <UserRoute>
        {loading && <SyncOutlined spin className='d-flex justify-content-center display-1 text-danger p-5' />}
        <h1 className='jumbotron text-center square w-100'>User dashboard</h1>

        {courses?.map((course) => (
          <div key={course._id} className='media pt-2 pb-1'>
            <Avatar size={80} shape='square' src={course.image ? course.image.Location : '/course.png'} />

            <div className='media-body pl-2'>
              <div className='row'>
                <div className='col'>
                  <Link href={`/user/course/${course.slug}`} className='pointer'>
                    <h5 className='mt-2 text-primary'>{course.name}</h5>
                  </Link>
                  <p style={{ marginTop: '-10px' }}>{course.lessons.length} lessons</p>
                  <p className='text-muted' style={{ marginTop: '-15px', fontSize: '12px' }}>
                    By {course.instructor.name}
                  </p>
                </div>
                <div className='col-md-3 mt-3 text-center align-self-center'></div>
              </div>
            </div>
            <Link href={`/user/course/${course.slug}`}>
              <PlayCircleOutlined className='h2 pointer text-primary mr-5' />
            </Link>
          </div>
        ))}
      </UserRoute>
    </>
  )
}

export default UserIndex
