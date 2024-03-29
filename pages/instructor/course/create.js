import { useState } from 'react'
import axios from 'axios'
import InstructorRoute from '../../../components/routes/InstructorRoute.js'
import CourseCreateForm from '../../../components/forms/CourseCreateForm.js'
import Resizer from 'react-image-file-resizer'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import Banner from '../../../components/layout/Banner'

const CourseCreate = () => {
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '9.99',
    uploading: false,
    paid: true,
    category: '',
    loading: false,
  })
  const [image, setImage] = useState({})
  const [preview, setPreview] = useState('')
  const [uploadButtonText, setUploadButtonText] = useState('Upload Image')
  const router = useRouter()

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleImage = (e) => {
    let file = e.target.files[0]
    setPreview(window.URL.createObjectURL(file))
    setUploadButtonText(file.name)
    setValues({ ...values, loading: true })
    // resize
    Resizer.imageFileResizer(file, 720, 500, 'JPEG', 100, 0, async (uri) => {
      try {
        let { data } = await axios.post('/api/course/upload-image', {
          image: uri,
        })
        setImage(data)
        setValues({ ...values, loading: false })
      } catch (err) {
        console.log(err)
        setValues({ ...values, loading: false })
        toast.error('Image upload failed. Try later.')
      }
    })
  }

  const handleImageRemove = async () => {
    try {
      setValues({ ...values, loading: true })
      const res = await axios.post('/api/course/remove-image', { image })
      setImage({})
      setPreview('')
      setUploadButtonText('Upload Image')
      setValues({ ...values, loading: false })
    } catch (err) {
      console.log(err)
      setValues({ ...values, loading: false })
      toast.error('Image upload failed. Try later.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/course', {
        ...values,
        image,
      })
      toast.success('Great! Now you can start adding lessons')
      setTimeout(() => {
        router.push('/instructor')
      }, 1500)
    } catch (err) {
      toast.error(err.response.data)
    }
  }

  return (
    <InstructorRoute>
      <Banner title='Create Course' />
      <div className='pt-3 pb-3'>
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          handleChange={handleChange}
          values={values}
          setValues={setValues}
          preview={preview}
          uploadButtonText={uploadButtonText}
          handleImageRemove={handleImageRemove}
        />
      </div>
      <hr />
    </InstructorRoute>
  )
}

export default CourseCreate
