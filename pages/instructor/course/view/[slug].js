import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import InstructorRoute from '../../../../components/routes/InstructorRoute.js'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { toast } from 'react-toastify'
import { Context } from '../../../../context/index.js'
import Back from '../../../../components/layout/Back.js'
import CreatedCourseList from '../../../../components/layout/CreatedCourseList.js'
import AddLesson from '../../../../components/layout/AddLesson.js'

const CourseView = ({ data }) => {
  const [course, setCourse] = useState({})
  const [visible, setVisible] = useState(false)
  const { windowSize } = useContext(Context)
  const router = useRouter()
  const { slug } = router.query

  useEffect(() => {
    setCourse(data)
  }, [])

  const handlePublish = async (e, courseId) => {
    try {
      let answer = window.confirm(
        'Once you publsih your course, it will be live in the marketplace for users to enroll'
      )
      if (!answer) return
      const { data } = await axios.put(`/api/course/publish/${courseId}`)
      setCourse(data)
      toast.success('Congrats! Your course is live')
    } catch (err) {
      toast.error('Course publish failed. Try again')
    }
  }

  const handleUnpublish = async (e, courseId) => {
    try {
      let answer = window.confirm('Once you unpublsih your course, it will no be available for users to enroll')
      if (!answer) return
      const { data } = await axios.put(`/api/course/unpublish/${courseId}`)
      setCourse(data)
      toast.success('Your course is unpublished')
    } catch (err) {
      toast.error('Course publish failed. Try again')
    }
  }

  return (
    <InstructorRoute>
      <Back />
      <div className='contianer-fluid pt-3'>
        {course && (
          <div className='container-fluid pt-1'>
            <CreatedCourseList course={course} handlePublish={handlePublish} handleUnpublish={handleUnpublish} />
            <hr />
            <h2 className='col text-center'>
              <ReactMarkdown children={course.description} />
            </h2>
            <AddLesson
              visible={visible}
              setVisible={setVisible}
              windowSize={windowSize}
              slug={slug}
              course={course}
              setCourse={setCourse}
            />
          </div>
        )}
      </div>
    </InstructorRoute>
  )
}

export async function getServerSideProps(context) {
  const { data } = await axios(`${process.env.API}/course/${context.query.slug}`)
  return {
    props: {
      data,
    },
  }
}

export default CourseView
