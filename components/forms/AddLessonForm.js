import { useState } from 'react'
import dynamic from 'next/dynamic'
// import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Button, Progress, Tooltip } from 'antd'
import { CloseCircleFilled } from '@ant-design/icons'
import { toast } from 'react-toastify'
import axios from 'axios'

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})

const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { header: '3' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    ['clean'],
  ],

  clipboard: {
    matchVisual: false,
  },
}

const AddLessonForm = ({ slug, course, setCourse, setVisible, windowSize }) => {
  const [content, setContent] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadButtonText, setUploadButtonText] = useState('Upload Video')
  const [progress, setProgress] = useState(0)
  const [values, setValues] = useState({
    title: '',
    content: '',
    video: {},
  })

  const handleAddLesson = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(`/api/course/lesson/${slug}/${course.instructor._id}`, values)
      setValues({ ...values, title: '', content: '', video: {} })
      setProgress(0)
      setUploadButtonText('Upload video')
      setVisible(false)
      setCourse(data)
      toast.success('Lesson added')
    } catch (err) {
      console.log(err)
      toast.error('Lesson add failed')
    }
  }

  const handleVideo = async (e) => {
    try {
      const file = e.target.files[0]
      setUploadButtonText(file.name)
      setUploading(true)
      const videoData = new FormData()
      videoData.append('video', file)
      const { data } = await axios.post(`/api/course/video-upload/${course.instructor._id}`, videoData, {
        onUploadProgress: (e) => {
          setProgress(Math.round((100 * e.loaded) / e.total))
        },
      })
      setValues({ ...values, video: data })
      setUploading(false)
    } catch (err) {
      console.log(err)
      setUploading(false)
      toast.error('Video upload failed')
    }
  }

  const handleVideoRemove = async () => {
    try {
      setUploading(true)
      const { data } = await axios.post(`/api/course/video-remove/${course.instructor._id}`, values.video)
      setValues({ ...values, video: {} })
      setUploading(false)
      setUploadButtonText('Upload another video')
    } catch (err) {
      console.log(err)
      setUploading(false)
      toast.error('Video remove failed')
    }
  }

  const handleContent = async (e) => {
    setContent(e)
    setValues({ ...values, content: content })
  }

  return (
    <div className='container pt-3'>
      <form onSubmit={handleAddLesson}>
        <input
          type='text'
          className='form-control square'
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          value={values.title}
          placeholder='Title'
          autoFocus
          required
        />
        <div className='quill-container' style={{ display: 'table' }}>
          <QuillNoSSRWrapper
            modules={modules}
            onChange={handleContent}
            theme='snow'
            style={windowSize.height < 1000 ? { height: '25vh' } : { height: '40vh' }}
          />
        </div>
        <div className='justify-content-center pt-5'>
          <label className='btn btn-dark btn-block text-center mt-5'>
            {uploadButtonText}
            <input onChange={handleVideo} type='file' accept='video/*' hidden />
            {!uploading && values.video.Location && (
              <Button style={{ backgroundColor: 'transparent', border: 'none' }} title='remove'>
                <span onClick={handleVideoRemove}>
                  <CloseCircleFilled className='text-danger d-flex float-right' />
                </span>
              </Button>
            )}
          </label>
        </div>
        {progress > 0 && <Progress className='d-flex justify-content-center pt-2' percent={progress} steps={10} />}
        <Button
          onClick={handleAddLesson}
          className='col mt-3'
          size='large'
          type='primary'
          loading={uploading}
          shape='round'
        >
          Save
        </Button>
      </form>
    </div>
  )
}

export default AddLessonForm
