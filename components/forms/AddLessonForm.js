import { useState } from 'react'
import QuillEditor from '../layout/QuillToolBar'
import { Button, Progress, Input } from 'antd'
import { toast } from 'react-toastify'
import axios from 'axios'
import Banner from '../layout/Banner'
import SelectMedia from '../layout/SelectMedia'

const AddLessonForm = ({ slug, course, setCourse, setVisible, windowSize }) => {
  const [video, setVideo] = useState({ video: undefined, url: undefined })
  const [pdfFile, setPdfFile] = useState({ pdf: undefined, url: undefined })
  const [uploading, setUploading] = useState(false)
  const [uploadButtonText, setUploadButtonText] = useState('Upload Video')
  const [uploadPdfText, setUploadButtonPdf] = useState('Upload Pdf')
  const [progress, setProgress] = useState(0)
  let [values, setValues] = useState({
    video: { Location: undefined },
    pdf: { Location: undefined },
  })
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const reset = () => {
    setValues({ video: { Location: undefined }, pdf: { Location: undefined } })
    setContent('')
    setTitle('')
    setUploading(false)
    setProgress(0)
    setUploadButtonText('Upload Video')
    setUploadButtonPdf('Upload Pdf')
  }

  const handleAddLesson = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(`/api/course/lesson/${slug}/${course.instructor._id}`, {
        title: title,
        content: content,
        video: values.video,
        pdf: values.pdf,
      })
      reset()
      setCourse(data)
      toast.success('Lesson added')
      setVisible(false)
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
      setValues({ ...values, video: { Location: undefined } })
      setUploading(false)
      setUploadButtonText('Upload another video')
    } catch (err) {
      console.log(err)
      setUploading(false)
      toast.error('Video remove failed')
    }
  }

  const handleURL = (e) => {
    setValues({ ...values, video: { Location: e.target.value } })
  }

  const handleOption = (e) => {
    if (e) return setVideo({ video: true, url: false })
    return setVideo({ url: true, video: false })
  }

  const handleOptionPdf = (e) => {
    if (e) return setPdfFile({ pdf: true, url: false })
    return setPdfFile({ url: true, pdf: false })
  }

  const handleURLPdf = (e) => {
    setValues({ ...values, pdf: { Location: e.target.value } })
  }

  const uploadPdf = async (e) => {
    try {
      const file = e.target.files[0]
      setUploadButtonPdf(file.name)
      setUploading(true)
      const pdfData = new FormData()
      pdfData.append('pdf', file)
      const { data } = await axios.post(`/api/course/pdf-upload/${course.instructor._id}`, pdfData, {
        onUploadProgress: (e) => {
          setProgress(Math.round((100 * e.loaded) / e.total))
        },
      })
      setValues({ ...values, pdf: data })
      setUploading(false)
    } catch (err) {
      console.log(err)
      setUploading(false)
      toast.error('Pdf upload failed')
    }
  }

  const removePdf = async () => {
    try {
      setUploading(true)
      const { data } = await axios.post(`/api/course/pdf-remove/${course.instructor._id}`, values.pdf)
      setValues({ ...values, pdf: { Location: undefined } })
      setUploading(false)
      setUploadButtonText('Upload another pdf')
    } catch (err) {
      console.log(err)
      setUploading(false)
      toast.error('Pdf remove failed')
    }
  }

  return (
    <>
      <Banner title='Add Lessons' small='small' />
      <div className='container pt-3'>
        <Input size='large' onChange={(e) => setTitle(e.target.value)} placeholder='Title' required value={title} />
        <QuillEditor windowSize={windowSize} content={content} setContent={setContent} />
        <div className='justify-content-center pt-5'>
          <SelectMedia
            placeholderSelect='Upload Video'
            placeholderURL='URL of Video'
            labelMedia='upload video file'
            labelURL='embed video url'
            handleSelect={handleOption}
            media={video}
            textBtn={uploadButtonText}
            handleOnChange={handleVideo}
            handleRemove={handleVideoRemove}
            uploading={uploading}
            values={values}
            handleURL={handleURL}
          />
          <SelectMedia
            placeholderSelect='Upload Pdf'
            placeholderURL='URL of Pdf'
            labelMedia='upload pdf file'
            labelURL='embed pdf url'
            handleSelect={handleOptionPdf}
            media={pdfFile}
            textBtn={uploadPdfText}
            handleOnChange={uploadPdf}
            handleRemove={removePdf}
            uploading={uploading}
            values={values}
            handleURL={handleURLPdf}
          />
        </div>
        {progress > 0 && <Progress className='d-flex justify-content-center pt-2' percent={progress} steps={10} />}
        <Button onClick={handleAddLesson} block className='mt-3' type='primary' loading={uploading} shape='round'>
          Save
        </Button>
        <Button
          onClick={() => {
            setVisible(false)
            reset()
          }}
          block
          type='dashed'
        >
          Cancel
        </Button>
      </div>
    </>
  )
}

export default AddLessonForm
