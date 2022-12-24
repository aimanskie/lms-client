import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import InstructorRoute from '../../../../components/routes/InstructorRoute.js'
import CourseCreateForm from '../../../../components/forms/CourseCreateForm.js'
import Resizer from 'react-image-file-resizer'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { List, Avatar, Modal } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import UpdateLessonForm from '../../../../components/forms/UpdateLessonForm.js'
import { Context } from '../../../../context/index.js'

const { Item } = List

const CourseEdit = () => {
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '9.99',
    uploading: false,
    paid: true,
    category: '',
    loading: false,
    lessons: [],
  })
  const [image, setImage] = useState({})
  const [preview, setPreview] = useState('')
  const [uploadButtonText, setUploadButtonText] = useState('Upload Image')
  const [visible, setVisible] = useState(false)
  const [current, setCurrent] = useState({})
  const router = useRouter()
  const { slug } = router.query
  const { windowSize } = useContext(Context)

  useEffect(() => {
    loadCourse()
  }, [slug])

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`)
    if (data) setValues(data)
    if (data?.image) setImage(data.image)
  }

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleImage = (e) => {
    let file = e.target.files[0]
    setPreview(window.URL.createObjectURL(file))
    setUploadButtonText(file.name)
    setValues({ ...values, loading: true })

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
      const { data } = await axios.put(`/api/course/${slug}`, {
        ...values,
        image,
      })
      toast.success('Course updated!')
      setTimeout(() => {
        router.back()
      }, 2000)
    } catch (err) {
      toast.error(err.response.data)
    }
  }

  const handleDrag = (e, index) => {
    e.dataTransfer.setData('itemIndex', index)
  }

  const handleDrop = async (e, index) => {
    const movingItemIndex = e.dataTransfer.getData('itemIndex')
    const targetItemIndex = index
    let allLessons = values.lessons

    let movingItem = allLessons[movingItemIndex]
    allLessons.splice(movingItemIndex, 1)
    allLessons.splice(targetItemIndex, 0, movingItem)

    setValues({ ...values, lessons: [...allLessons] })
    const { data } = await axios.put(`/api/course/${slug}`, {
      ...values,
      image,
    })
    toast.success('Lessons rearranged successfully')
  }

  const handleDelete = async (index) => {
    const answer = window.confirm('Are you sure you want to delete?')
    if (!answer) return
    let allLessons = values.lessons
    const removed = allLessons.splice(index, 1)
    setValues({ ...values, lessons: allLessons })
    const { data } = await axios.put(`/api/course/${slug}/${removed[0]._id}`)
  }

  return (
    <InstructorRoute>
      <h1 className='jumbotron text-center square'>Update Course</h1>
      <div className='pt-3 pb-3'>
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImageRemove={handleImageRemove}
          handleImage={handleImage}
          handleChange={handleChange}
          values={values}
          setValues={setValues}
          preview={preview}
          uploadButtonText={uploadButtonText}
          editPage={true}
        />
      </div>
      <hr />
      <div className='row pb-5'>
        <div className='col lesson-list'>
          <h4>{values && values.lessons && values.lessons.length} Lessons</h4>
          <List>
            <Item>Drag and drop to arrange the lessons</Item>
            <Item>Press on the lessons to edit</Item>
          </List>
          <List
            onDragOver={(e) => e.preventDefault()}
            itemLayout='horizontal'
            dataSource={values && values.lessons}
            renderItem={(item, index) => (
              <Item draggable onDragStart={(e) => handleDrag(e, index)} onDrop={(e) => handleDrop(e, index)}>
                <Item.Meta
                  onClick={() => {
                    setVisible(true)
                    setCurrent(item)
                  }}
                  avatar={<Avatar>{index + 1}</Avatar>}
                  title={item.title}
                  style={{ cursor: 'pointer' }}
                ></Item.Meta>
                <DeleteOutlined onClick={() => handleDelete(index)} className='text-danger float-right' />
              </Item>
            )}
          ></List>
        </div>
      </div>

      <Modal
        title='Update lesson'
        centered
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        bodyStyle={windowSize.height < 1000 ? { height: '60vh' } : { height: '70vh' }}
      >
        <UpdateLessonForm
          current={current}
          setCurrent={setCurrent}
          setVisible={setVisible}
          windowSize={windowSize}
          setValues={setValues}
          values={values}
          slug={slug}
        />
      </Modal>
    </InstructorRoute>
  )
}

export default CourseEdit
