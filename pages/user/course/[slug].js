import React, { useState, useEffect, useContext, useRef } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import StudentRoute from '../../../components/routes/StudentRoute.js'
import { Button, Menu } from 'antd'
import ReactPlayer from 'react-player'
import ReactMarkdown from 'react-markdown'
import { PlayCircleOutlined, CheckCircleFilled, MinusCircleFilled } from '@ant-design/icons'
import { Context } from '../../../context'

const { Item } = Menu

const SingleCourse = () => {
  const [clicked, setClicked] = useState(-1)
  const [course, setCourse] = useState({ lessons: [] })
  let [objStore, setObjStore] = useState({})
  const [completedLessons, setCompletedLessons] = useState([])
  const [updateState, setUpdateState] = useState(false)
  const [mediaQuery, setMediaQuery] = useState({ width: '30vh', height: '80vh', overflow: 'scroll' })
  const [mediaQuery2, setMediaQuery2] = useState({
    fontSize: '50px',
    textAlign: 'center',
    alignItems: 'center',
  })
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  })

  const {
    state: { user },
    // dispatch,
  } = useContext(Context)
  const router = useRouter()
  const { slug } = router.query
  const player = useRef()

  useEffect(() => {
    if (slug) loadCourse()
  }, [slug])

  useEffect(() => {
    if (course) loadCompletedLessons()
  }, [course])

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/user/course/${slug}`)
    setCourse(data)
  }

  const loadCompletedLessons = async () => {
    const { data } = await axios.post(`/api/list-completed`, {
      courseId: course._id,
    })
    setCompletedLessons(data)
  }

  useEffect(() => {
    if (windowSize.width < 600)
      setMediaQuery({
        width: '15vh',
        height: '100vh',
        overflow: 'scroll',
        fontSize: '14px',
      })
    if (windowSize.width < 390) {
      setMediaQuery({
        width: '13vh',
        height: '100vh',
        overflow: 'scroll',
        fontSize: '9px',
      })
      setMediaQuery2({
        paddingTop: '50px',
        fontSize: '20px',
        textAlign: 'center',
        alignItems: 'center',
      })
    }
    if (windowSize.width > 600) {
      setMediaQuery({
        width: '30vh',
        height: '100vh',
        overflow: 'scroll',
      })
      setMediaQuery2({
        paddingTop: '100px',
        fontSize: '50px',
        textAlign: 'center',
        alignItems: 'center',
      })
    }
    if (windowSize.width > 1200)
      setMediaQuery({
        width: '30vh',
        height: '100vh',
        overflow: 'scroll',
        fontSize: '22px',
      })
  }, [windowSize])

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const markCompleted = async () => {
    const { data } = await axios.post(`/api/mark-completed`, {
      courseId: course._id,
      lessonId: course.lessons[clicked]._id,
    })
    setCompletedLessons(data.lessons)
    objStore[clicked] = 0
    let obj = objStore
    window.localStorage.setItem('lesson', JSON.stringify(obj))
    setTimeout(() => {
      handleBtnClick()
    }, 2000)
  }

  const markIncompleted = async () => {
    try {
      const { data } = await axios.post(`/api/mark-incomplete`, {
        courseId: course._id,
        lessonId: course.lessons[clicked]._id,
      })
      const all = completedLessons
      const index = all.indexOf(course.lessons[clicked]._id)
      if (index > -1) {
        all.splice(index, 1)
        setCompletedLessons(all)
        setUpdateState(!updateState)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (clicked !== -1) handleReady()
  }, [clicked])

  const handleReady = () => {
    if (!objStore[clicked]) {
      objStore[clicked] = 0
      let obj = objStore
      setObjStore(obj)
      window.localStorage.setItem('lesson', JSON.stringify(obj))
    }
    let startDuration = JSON.parse(window.localStorage.getItem('lesson'))
    player.current.seekTo(startDuration[clicked])
  }

  const handleStop = () => {
    let timeStamp = player.current.getCurrentTime()
    objStore[clicked] = timeStamp
    let obj = objStore
    setObjStore(obj)
    window.localStorage.setItem('lesson', JSON.stringify(obj))
  }

  const handleBtnClick = () => {
    if (clicked + 1 === course.lessons.length) return setClicked(0)
    else return setClicked(clicked + 1)
  }

  return (
    <StudentRoute>
      <div className='row'>
        <div>
          <Button className='text-primary mt-1 btn-block mb-2'>
            {((completedLessons.length / course.lessons.length) * 100).toFixed(0)}% Complete
          </Button>
          <Menu selectedKeys={[clicked]} style={mediaQuery}>
            {course.lessons.map((lesson, index) => (
              <Item onClick={() => setClicked(index)} key={index}>
                {lesson.title.substring(0, 30)}{' '}
                {completedLessons.includes(lesson._id) ? (
                  <CheckCircleFilled className='float-right text-primary ml-2' style={{ marginTop: '13px' }} />
                ) : (
                  <MinusCircleFilled className='float-right text-danger ml-2' style={{ marginTop: '13px' }} />
                )}
              </Item>
            ))}
          </Menu>
        </div>

        <div className='col'>
          {clicked !== -1 ? (
            <>
              <div className='col'>
                <h3 style={{ textAlign: 'center', paddingTop: '20px' }} className='m-0 col'>
                  {course.lessons[clicked].title.substring(0, 30)}
                </h3>
                <button className='float-right m-0' onClick={() => markCompleted()}>
                  Mark complete and next lesson
                </button>
                <button className='float-right m-0' onClick={() => setClicked(clicked - 1)}>
                  previous lesson
                </button>

                {completedLessons.includes(course.lessons[clicked]._id) ? (
                  <p className='float-left pointer' onClick={markIncompleted}>
                    Still watching, press here to mark as incomplete
                  </p>
                ) : (
                  ''
                )}
              </div>

              {course.lessons &&
                course.lessons[clicked] &&
                course.lessons[clicked].video &&
                course.lessons[clicked].video.Location && (
                  <div className='wrapper' style={{ marginTop: '50px' }}>
                    <ReactPlayer
                      ref={player}
                      className='player'
                      url={course.lessons[clicked].video.Location}
                      width='100%'
                      height='100%'
                      controls
                      onPause={() => handleStop()}
                      onEnded={() => markCompleted()}
                      config={{ file: { attributes: { controlsList: 'nodownload' } } }}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  </div>
                )}

              <ReactMarkdown children={course.lessons[clicked].content} className='single-post' />
            </>
          ) : (
            <div style={mediaQuery2} onClick={() => setClicked(0)}>
              <PlayCircleOutlined />
              <div>Start</div>
            </div>
          )}
        </div>
      </div>
    </StudentRoute>
  )
}

export default SingleCourse
