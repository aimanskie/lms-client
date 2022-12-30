import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Button, Progress, Switch, Input, Select } from 'antd'
import ReactPlayer from 'react-player'
import QuillEditor from '../layout/QuillToolBar'
import Banner from '../layout/Banner'
import usePath from '../../utils/path'
import SelectMedia from '../layout/SelectMedia'

const UpdateLessonForm = ({ current, setCurrent, setVisible, windowSize, setValues, values, slug }) => {
  // const [uploadVideoButtonText, setUploadVideoButtonText] = useState('Upload Video')
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [video, setVideo] = useState({ video: undefined, url: undefined })
  const [hostname, setHostname] = useState(null)
  const [ifFrame, setIfframe] = useState(null)
  const [pdfFile, setPdfFile] = useState({ pdf: undefined, url: undefined })

  const handleUpdateLesson = async (e) => {
    e.preventDefault()
    const { data } = await axios.put(`/api/course/lesson/${slug}/${current._id}`, current)
    setUploadVideoButtonText('Upload Video')
    console.log(data)
    // setVisible(false)
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
    if (current?.video?.Location) {
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
    setCurrent({ ...current, content: e })
  }

  const handleOption = (e) => {
    if (e) return setVideo({ video: true, url: false })
    return setVideo({ url: true, video: false })
  }

  const handleURL = (e) => {
    setCurrent({ ...current, video: { Location: e.target.value } })
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
    spaceYoutube.style.width = '100%'
    spaceYoutube.style.height = '100%'
    setIfframe(iFrame)
    ifFrame?.classList.add('edit')
  }

  const handleOptionPdf = (e) => {
    if (e) return setPdfFile({ pdf: true, url: false })
    return setPdfFile({ url: true, pdf: false })
  }

  const handleURLPdf = (e) => {
    setValues({ ...values, pdf: { Location: e.target.value } })
  }
  return (
    <>
      <Banner title='Edit Lessons' small='small' />
      <div className='container pt-3'>
        <Input
          size='large'
          onChange={(e) => setCurrent({ ...current, title: e.target.value })}
          value={current.title}
          required
        />
        <QuillEditor windowSize={windowSize} content={current.content} setContent={setCurrent} />

        <SelectMedia
          placeholderSelect='Upload Video'
          placeholderURL='URL of Video'
          labelMedia='upload video file'
          labelURL='embed video url'
          handleSelect={handleOption}
          media={video}
          // textBtn=''
          handleOnChange={handleVideo}
          // handleRemove={handleVideoRemove}
          uploading={uploading}
          values={values}
          handleURL={handleURL}
          current={current}
          hostname={hostname}
        />

        {progress > 0 && <Progress className='d-flex justify-content-center pt-2' percent={progress} steps={10} />}
        <div className='d-flex justify-content-between'>
          {current?.video?.Location && (
            <>
              <span className='pt-3 badge'>Preview</span>
              <Switch
                className='float-right mt-2'
                disabled={uploading}
                checked={current.free_preview}
                name='free_preview'
                onChange={(v) => setCurrent({ ...current, free_preview: v })}
              />
            </>
          )}
        </div>
        <Button
          onClick={handleUpdateLesson}
          block
          className='mt-3'
          // size='large'
          type='primary'
          loading={uploading}
          shape='round'
          // style={{ width: '86%', position: 'absolute', bottom: '10px' }}
        >
          Save
        </Button>
        <Button
          onClick={() => {
            setVisible(false)
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

export default UpdateLessonForm
