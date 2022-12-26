import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Button, Progress, Switch, Input, Select } from 'antd'
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
    ['link', 'image'],
    ['clean'],
  ],
  clipboard: {
    matchVisual: false,
  },
}
const UpdateLessonForm = ({ current, setCurrent, setVisible, windowSize, setValues, values, slug }) => {
  const [uploadVideoButtonText, setUploadVideoButtonText] = useState('Upload Video')
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [video, setVideo] = useState({ video: undefined, url: undefined })
  const [iFrame, setIframe] = useState(null)
  const [hostname, setHostname] = useState(null)

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

  const handleOption = (e) => {
    if (e) return setVideo({ video: true, url: false })
    return setVideo({ url: true, video: false })
  }

  const handleURL = (e) => {
    setCurrent({ ...values, video: { Location: e.target.value } })
  }

  useEffect(() => {
    if (!current?.video?.Location) return
    const { hostname } = new URL(current?.video?.Location)
    setHostname(hostname)
  }, [current?.video?.Location])

  const changeSizeYouTube = () => {
    const iFrame = document.querySelector('iframe')
    const space = document.querySelector(
      'body > div:nth-child(6) > div > div.ant-modal-wrap.ant-modal-centered > div > div.ant-modal-content > div.ant-modal-body > div > form > div.mt-5.pt-5 > div'
    )
    space?.classList.add('youtube')
    const spaceYoutube = document.querySelector('.youtube')
    spaceYoutube.style = { wdith: '100%', height: '100%' }
    setIframe(iFrame)
    iFrame?.classList.add('edit')
    console.log(iFrame)
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
          style={
            windowSize.height > 1200
              ? { height: '50vh', marginBottom: '10px' }
              : windowSize.height > 855
              ? { height: '40vh', marginBottom: '10px' }
              : windowSize.height > 680
              ? { height: '30vh', marginBottom: '10px' }
              : { height: '10vh', marginBottom: '10px' }
          }
          value={current.content}
        />

        <>
          {!uploading && current?.video?.Location && (
            <div className='mt-5 pt-5'>
              {hostname === 'ems-dev.s3.ap-southeast-1.amazonaws.com' ? (
                <>
                  {windowSize.height > 1000 ? (
                    <ReactPlayer url={current.video.Location} width='410px' height='240px' controls />
                  ) : (
                    <ReactPlayer url={current.video.Location} width='270px' height='150px' controls />
                  )}
                </>
              ) : (
                <ReactPlayer url={current.video.Location} controls onReady={changeSizeYouTube} />
              )}
            </div>
          )}

          <div style={{ margin: 0 }} className='beforeyoutube'>
            {current?.video?.Location ? (
              <>
                {hostname === 'ems-dev.s3.ap-southeast-1.amazonaws.com' ? (
                  <label className='btn btn-dark btn-block text-left mt-3'>
                    {uploadVideoButtonText}
                    <input onChange={handleVideo} type='file' accept='video/*' hidden />
                  </label>
                ) : (
                  <Input
                    placeholder='Vimeo, Youtube links'
                    onChange={handleURL}
                    type='text'
                    value={current.video.Location}
                  />
                )}
              </>
            ) : (
              <>
                <div className='pt-5 mt-5'>
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
                  {video.video && (
                    <label className='btn btn-dark btn-block text-left mt-2'>
                      {uploadVideoButtonText}
                      <input onChange={handleVideo} type='file' accept='video/*' hidden />
                    </label>
                  )}
                  {video.url && (
                    <Input
                      placeholder='Vimeo, Youtube links'
                      onChange={handleURL}
                      type='text'
                      style={{ width: '100%', textAlign: 'center' }}
                      value={current.video.Location}
                      className='mt-2'
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </>

        {progress > 0 && <Progress className='d-flex justify-content-center pt-2' percent={progress} steps={10} />}

        <div className='d-flex justify-content-between'>
          {current?.video?.Location && (
            <>
              {' '}
              <span className='pt-3 badge'>Preview</span>
              <Switch
                className='float-right mt-2'
                disabled={uploading}
                checked={current.free_preview}
                name='free_preview'
                onChange={(v) => setCurrent({ ...current, free_preview: v })}
              />
            </>
          )}{' '}
        </div>

        <Button
          onClick={handleUpdateLesson}
          className='col mt-3'
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

export default UpdateLessonForm
