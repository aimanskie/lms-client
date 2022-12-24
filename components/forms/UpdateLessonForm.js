import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Button, Progress, Switch } from 'antd'
import ReactPlayer from 'react-player'
import dynamic from 'next/dynamic'
const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})
import 'react-quill/dist/quill.snow.css'

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
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
}
const UpdateLessonForm = ({ current, setCurrent, setVisible, windowSize, setValues, values, slug }) => {
  const [uploadVideoButtonText, setUploadVideoButtonText] = useState('Upload Video')
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)

  const handleUpdateLesson = async (e) => {
    e.preventDefault()
    const { data } = await axios.put(`/api/course/lesson/${slug}/${current._id}`, current)
    setUploadVideoButtonText('Upload Video')
    setVisible(false)
    // update ui
    if (data.ok) {
      let arr = values.lessons
      const index = arr.findIndex((el) => el._id === current._id)
      arr[index] = current
      setValues({ ...values, lessons: arr })
      toast.success('Lesson updated')
    }
  }
  const handleVideo = async (e) => {
    // remove previous video
    if (current.video && current.video.Location) {
      const res = await axios.post(`/api/course/video-remove/${values.instructor._id}`, current.video)
    }
    // upload
    const file = e.target.files[0]
    setUploadVideoButtonText(file.name)
    setUploading(true)
    // send video as form data
    const videoData = new FormData()
    videoData.append('video', file)
    videoData.append('courseId', values._id)
    // save progress bar and send video as form data to backend
    const { data } = await axios.post(`/api/course/video-upload/${values.instructor._id}`, videoData, {
      onUploadProgress: (e) => setProgress(Math.round((100 * e.loaded) / e.total)),
    })
    setCurrent({ ...current, video: data })
    setUploading(false)
  }

  const handleContent = (e) => {
    setCurrent((prev) => {
      return { ...prev, content: e }
    })
  }
  return (
    <div className='container pt-3'>
      <form onSubmit={handleUpdateLesson}>
        <input
          type='text'
          className='form-control square'
          onChange={(e) => setCurrent({ ...current, title: e.target.value })}
          value={current.title}
          autoFocus
          required
        />
        <QuillNoSSRWrapper
          modules={modules}
          onChange={handleContent}
          theme='snow'
          style={windowSize.height < 1000 ? { height: '10vh' } : { height: '25vh' }}
          value={current.content}
        />

        <div d-flex justify-content-center>
          {!uploading && current.video && current.video.Location && (
            <div className='mt-5 pt-5 d-flex justify-content-center'>
              {windowSize.height > 1000 ? (
                <ReactPlayer url={current.video.Location} width='410px' height='240px' controls />
              ) : (
                <ReactPlayer url={current.video.Location} width='270px' height='150px' controls />
              )}
            </div>
          )}

          {current?.video?.Location ? (
            <label className='btn btn-dark btn-block text-left mt-3'>
              {uploadVideoButtonText}
              <input onChange={handleVideo} type='file' accept='video/*' hidden />
            </label>
          ) : (
            <>
              <div className='pt-5'>
                <label className='btn btn-dark btn-block text-left mt-3 mt-5'>
                  {uploadVideoButtonText}
                  <input onChange={handleVideo} type='file' accept='video/*' hidden />
                </label>
              </div>
            </>
          )}
        </div>

        {progress > 0 && <Progress className='d-flex justify-content-center pt-2' percent={progress} steps={10} />}

        <div className='d-flex justify-content-between'>
          <span className='pt-3 badge'>Preview</span>
          <Switch
            className='float-right mt-2'
            disabled={uploading}
            checked={current.free_preview}
            name='free_preview'
            onChange={(v) => setCurrent({ ...current, free_preview: v })}
          />
        </div>

        <Button
          onClick={handleUpdateLesson}
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

export default UpdateLessonForm
