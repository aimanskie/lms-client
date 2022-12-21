import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import SingleCourseJumbotron from '../../components/cards/SingleCourseJumbotron.js'
import PreviewModal from '../../components/modal/PreviewModal.js'
import SingleCourseLessons from '../../components/cards/SingleCourseLessons.js'
import { Context } from '../../context'
import { toast } from 'react-toastify'
import { loadStripe } from '@stripe/stripe-js'

const SingleCourse = ({ course }) => {
  const [showModal, setShowModal] = useState(false)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [enrolled, setEnrolled] = useState({})

  const {
    state: { user },
  } = useContext(Context)

  useEffect(() => {
    if (user && course) checkEnrollment()
  }, [user, course])

  const checkEnrollment = async () => {
    const { data } = await axios.get(`/api/check-enrollment/${course._id}`)
    setEnrolled(data)
  }

  const router = useRouter()
  const { slug } = router.query

  const handlePaidEnrollment = async () => {
    try {
      setLoading(true)
      if (!user) router.push('/login')
      if (enrolled.status) return router.push(`/user/course/${enrolled.course.slug}`)
      const { data } = await axios.post(`/api/paid-enrollment/${course._id}`)
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)
      stripe.redirectToCheckout({ sessionId: data })
    } catch (err) {
      toast.error('Enrollment failed, try again.')
      console.log(err)
      setLoading(false)
    }
  }

  const handleFreeEnrollment = async (e) => {
    e.preventDefault()
    try {
      if (!user) router.push('/login')
      if (enrolled.status) return router.push(`/user/course/${enrolled.course.slug}`)
      setLoading(true)
      const { data } = await axios.post(`/api/free-enrollment/${course._id}`)
      toast.success(data.message)
      setLoading(false)
      router.push(`/user/course/${data.course.slug}`)
    } catch (err) {
      toast.error('Enrollment failed. Try again.')
      console.log(err)
      setLoading(false)
    }
  }

  return (
    <>
      <SingleCourseJumbotron
        course={course}
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
        setPreview={setPreview}
        user={user}
        loading={loading}
        handlePaidEnrollment={handlePaidEnrollment}
        handleFreeEnrollment={handleFreeEnrollment}
        enrolled={enrolled}
        setEnrolled={setEnrolled}
      />

      <PreviewModal showModal={showModal} setShowModal={setShowModal} preview={preview} />

      {course.lessons && (
        <SingleCourseLessons
          lessons={course.lessons}
          setPreview={setPreview}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </>
  )
}

export async function getServerSideProps({ query }) {
  const { data } = await axios.get(`${process.env.API}/course/${query.slug}`)
  return {
    props: {
      course: data,
    },
  }
}

export default SingleCourse
