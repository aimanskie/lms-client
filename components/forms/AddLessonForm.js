import { useState } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import { Button, Progress, Select, Input, Form } from 'antd'
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
    ['link', 'image'],
    ['clean'],
  ],
  clipboard: {
    matchVisual: false,
  },
}

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

  const handleAddLesson = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(`/api/course/lesson/${slug}/${course.instructor._id}`, {
        title: title,
        content: content,
        video: values.video,
        pdf: values.pdf,
      })
      setValues({ video: { Location: undefined }, pdf: { Location: undefined } })
      setContent('')
      setTitle('')
      setUploading(false)
      setProgress(0)
      setUploadButtonText('Upload Video')
      setUploadButtonPdf('Upload Pdf')
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
    <div className='container pt-3'>
      <form>
        <input
          type='text'
          className='form-control square'
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Title'
          required
          value={title}
        />
        <div>
          <QuillNoSSRWrapper
            modules={modules}
            onChange={(e) => setContent(e)}
            theme='snow'
            style={
              windowSize.height > 1200
                ? { height: '50vh', marginBottom: '10px' }
                : windowSize.height > 855
                ? { height: '40vh', marginBottom: '10px' }
                : windowSize.height > 680
                ? { height: '30vh', marginBottom: '10px' }
                : { height: '10vh', marginBottom: '10px' }
            }
            value={content}
          />
        </div>
        <div className='justify-content-center pt-5'>
          <Select
            placeholder='Upload Video'
            style={{
              width: '100%',
              marginTop: '10px',
              textAlign: 'center',
            }}
            onChange={handleOption}
            options={[
              {
                value: true,
                label: 'video upload',
              },
              {
                value: false,
                label: 'url',
              },
            ]}
          />
          {video?.video && (
            <label className='btn btn-dark btn-block text-center'>
              {uploadButtonText}
              <Input onChange={handleVideo} type='file' accept='video/*' hidden />
              {!uploading && values?.video?.Location && (
                <Button style={{ backgroundColor: 'transparent', border: 'none' }} title='remove'>
                  <span onClick={handleVideoRemove}>
                    <CloseCircleFilled className='text-danger d-flex float-right' />
                  </span>
                </Button>
              )}
            </label>
          )}
          {video?.url && (
            <Input
              placeholder='Vimeo, Youtube links'
              onChange={handleURL}
              type='text'
              style={{ width: '100%', textAlign: 'center', marginTop: 1, padding: 3 }}
              value={values.video.Location}
            />
          )}
          <Select
            placeholder='Upload Pdf'
            style={{
              width: '100%',
              textAlign: 'center',
              marginTop: '5px',
            }}
            onChange={handleOptionPdf}
            options={[
              {
                value: true,
                label: 'pdf upload',
              },
              {
                value: false,
                label: 'url',
              },
            ]}
          />
          {pdfFile?.url && (
            <Input
              placeholder='PDF Url'
              onChange={handleURLPdf}
              type='text'
              style={{ textAlign: 'center', marginTop: 5, padding: 5 }}
              value={values.pdf.Location}
            />
          )}
          {pdfFile?.pdf && (
            <label className='btn btn-dark btn-block text-center'>
              {uploadPdfText}
              <Input onChange={uploadPdf} type='file' accept='application/pdf' hidden />
              {!uploading && values?.pdf?.Location && (
                <Button style={{ backgroundColor: 'transparent', border: 'none' }} title='remove'>
                  <span onClick={removePdf}>
                    <CloseCircleFilled className='text-danger d-flex float-right' />
                  </span>
                </Button>
              )}
            </label>
          )}
        </div>
        {progress > 0 && <Progress className='d-flex justify-content-center pt-2' percent={progress} steps={10} />}
        <Button
          onClick={handleAddLesson}
          className='mt-1'
          size='large'
          type='primary'
          loading={uploading}
          shape='round'
          style={{ width: '86%', position: 'absolute', bottom: '10px' }}
        >
          Save
        </Button>
      </form>
    </div>
  )
}

export default AddLessonForm
