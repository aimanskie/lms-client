import { useRouter } from 'next/router'
import { Modal, Tooltip } from 'antd'
import { QuestionOutlined, CheckOutlined, EditOutlined, CloseOutlined } from '@ant-design/icons'
import CourseCreateForm from '../forms/CourseCreateForm'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import Resizer from 'react-image-file-resizer'

export const PublicationCheck = ({ windowSize, course, handlePublish, handleUnpublish, setCourse }) => {
  const [editCourseVisible, setEditCourseVisible] = useState(false)
  // const [image, setImage] = useState({})
  const [uploadButtonText, setUploadButtonText] = useState('Upload Image')
  const [preview, setPreview] = useState('')
  // const [values, setValues] = useState({
  //   name: '',
  //   description: '',
  //   price: '9.99',
  //   uploading: false,
  //   paid: true,
  //   category: '',
  //   loading: false,
  //   lessons: [],
  // })
  const router = useRouter()
  const { slug } = router.query

  // useEffect(() => {
  //   // setValues(course)
  //   setImage(course.image)
  // }, [])

  const handleImage = (e) => {
    let file = e.target.files[0]
    setPreview(window.URL.createObjectURL(file))
    setUploadButtonText(file.name)
    // setValues({ ...values, loading: true })
    setCourse({ ...course, loading: true })

    Resizer.imageFileResizer(file, 720, 500, 'JPEG', 100, 0, async (uri) => {
      try {
        let { data } = await axios.post('/api/course/upload-image', {
          image: uri,
        })
        // setImage(data)
        // setValues({ ...values, loading: false })
        setCourse({ ...course, image: data, loading: false })
      } catch (err) {
        console.log(err)
        // setValues({ ...values, loading: false })
        setCourse({ ...course, loading: false })
        toast.error('Image upload failed. Try later.')
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.put(`/api/course/${slug}`, {
        ...course,
        // image,
      })
      toast.success('Course updated!')
      setTimeout(() => {
        setEditCourseVisible(false)
        // router.reload()
      }, 2000)
    } catch (err) {
      console.log(err)
      toast.error(err.response.data)
    }
  }

  const handleImageRemove = async () => {
    try {
      // setValues({ ...values, loading: true })
      setCourse({ ...course, loading: true })
      const res = await axios.post('/api/course/remove-image', { image })
      // setImage({})
      setPreview('')
      setUploadButtonText('Upload Image')
      // setValues({ ...values, loading: false })
      setCourse({ ...course, loading: false })
    } catch (err) {
      console.log(err)
      // setValues({ ...values, loading: false })
      setCourse({ ...course, loading: false })
      toast.error('Image upload failed. Try later.')
    }
  }

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value })
  }

  return (
    <>
      <div className='d-flex pt-4 mr-4'>
        <Tooltip title='Edit Lessons'>
          <EditOutlined
            onClick={() => setEditCourseVisible(!editCourseVisible)}
            className='h5 pointer text-warning mr-4'
            style={{ fontSize: '25px' }}
          />
        </Tooltip>

        {course?.lessons?.length < 2 ? (
          <Tooltip title='Min 2 lessons required to publish'>
            <QuestionOutlined className='h5 pointer text-danger' size={'large'} />
          </Tooltip>
        ) : course.published ? (
          <Tooltip title='Unpublish'>
            <CloseOutlined onClick={(e) => handleUnpublish(e, course._id)} className='h5 pointer text-danger' />
          </Tooltip>
        ) : (
          <Tooltip title='Publish'>
            <CheckOutlined
              onClick={(e) => handlePublish(e, course._id)}
              className='h5 pointer text-success'
              style={{ fontSize: '25px' }}
            />
          </Tooltip>
        )}
      </div>
      <Modal
        centered
        open={editCourseVisible}
        onCancel={() => setEditCourseVisible(false)}
        footer={null}
        width={windowSize.width}
        bodyStyle={{ height: windowSize.height }}
      >
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImageRemove={handleImageRemove}
          handleImage={handleImage}
          handleChange={handleChange}
          values={course}
          setValues={setCourse}
          preview={preview}
          uploadButtonText={uploadButtonText}
          editPage={true}
          setEditCourseVisible={setEditCourseVisible}
        />
      </Modal>
    </>
  )
}
