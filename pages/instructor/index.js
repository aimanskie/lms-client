import { useState, useEffect } from 'react'
import axios from 'axios'
import InstructorRoute from '../../components/routes/InstructorRoute.js'
import { Avatar, Tooltip } from 'antd'
import Link from 'next/link'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import Banner from '../../components/layout/Banner.js'
import CreatedCourseList from '../../components/layout/CreatedCourseList.js'

const InstructorIndex = () => {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    const { data } = await axios.get('/api/instructor-courses')
    setCourses(data)
  }

  const myStyle = { marginTop: '-15px', fontSize: '10px' }

  return (
    <InstructorRoute>
      <Banner title='Instructor' />
      {courses?.map((course, idx) => (
        <div key={idx}>
          <CreatedCourseList course={course} myStyle={myStyle} />
        </div>
      ))}
    </InstructorRoute>
  )
}

export default InstructorIndex
