import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import StudentRoute from '../../../components/routes/StudentRoute.js'
import { Menu, Button, Drawer } from 'antd'
import ReactPlayer from 'react-player'
import ReactMarkdown from 'react-markdown'
import { PlayCircleOutlined, CheckCircleFilled, MinusCircleFilled, BookOutlined } from '@ant-design/icons'

const SingleCourse = () => {
  const [clicked, setClicked] = useState(-1)
  const [openDrawer, setOpenDrawer] = useState(false)
  const [course, setCourse] = useState({ lessons: [] })
  let [objStore, setObjStore] = useState({})
  const [completedLessons, setCompletedLessons] = useState([])
  const [updateState, setUpdateState] = useState(false)

  const router = useRouter()
  const { slug } = router.query
  const player = useRef()

  useEffect(() => {
    if (slug) {
      axios(`/api/user/course/${slug}`)
        .then((res) => {
          setCourse(res.data)
        })
        .catch((err) => console.log(err))
    }
  }, [slug])

  useEffect(() => {
    if (course) {
      axios
        .post(`/api/list-completed`, {
          courseId: course._id,
        })
        .then((res) => {
          setCompletedLessons(res.data)
        })
        .catch((err) => console.log(err))
    }
  }, [course])

  const markCompleted = () => {
    if (completedLessons.includes(course.lessons[clicked]._id)) return cleanUp()
    if (clicked + 1 === course.lessons.length) setUpdateState(true)

    axios
      .post(`/api/mark-completed`, {
        courseId: course._id,
        lessonId: course.lessons[clicked]._id,
      })
      .then(() => {
        setCompletedLessons((prevData) => [...prevData, course.lessons[clicked]._id])
        cleanUp()
      })
      .catch((err) => console.log(err))
  }

  const cleanUp = async () => {
    objStore[clicked] = 0
    let obj = objStore
    window.localStorage.setItem('lesson', JSON.stringify(obj))
    setTimeout(() => {
      handleBtnClick()
    }, 1000)
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
    if (startDuration[clicked] !== 0) player.current.seekTo(startDuration[clicked])
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
    else return setClicked((currentClick) => currentClick + 1)
  }

  const handleOpen = () => {
    setOpenDrawer(true)
  }
  console.log(clicked)
  return (
    <StudentRoute>
      {clicked !== -1 ? (
        <>
          <Lessons
            openDrawer={openDrawer}
            setOpenDrawer={setOpenDrawer}
            course={course}
            completedLessons={completedLessons}
            clicked={clicked}
            setClicked={setClicked}
          />
          <div className='col' style={{ textAlign: 'center', margin: '0 auto' }}>
            <Button type='primary' onClick={handleOpen} icon={<BookOutlined />} block style={{ width: '50%' }}>
              Press to see all lessons
            </Button>
            <h3 style={{ marginTop: 20 }}>{course?.lessons?.[clicked]?.title?.substring(0, 30)}</h3>
            {completedLessons?.includes(course?.lessons?.[clicked]?._id) ? (
              <Button type='dashed' onClick={markIncompleted}>
                Still watching, press here to mark as incomplete
              </Button>
            ) : (
              ''
            )}
          </div>
          {course?.lessons?.[clicked]?.video?.Location && (
            <div className='wrapper' style={{ marginTop: '20px' }}>
              <ReactPlayer
                ref={player}
                className='player'
                url={course?.lessons?.[clicked]?.video?.Location}
                width='100%'
                height='100%'
                controls
                onPause={handleStop}
                onEnded={markCompleted}
                config={{ file: { attributes: { controlsList: 'nodownload' } } }}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
          )}
          <ReactMarkdown children={course?.lessons?.[clicked]?.content} className='single-post' />
        </>
      ) : updateState ? (
        <h1 style={{ color: 'black' }}>Congrats!</h1>
      ) : (
        <div
          onClick={() => setClicked((currentClick) => currentClick + 1)}
          style={{ fontSize: '5em', textAlign: 'center', padding: 30 }}
        >
          <PlayCircleOutlined />
          <div>Start</div>
        </div>
      )}
    </StudentRoute>
  )
}

const Lessons = ({ openDrawer, setOpenDrawer, course, completedLessons, clicked, setClicked }) => {
  const items = course.lessons.map((lesson, index) => {
    return {
      label: lesson.title,
      key: index,
      icon: completedLessons?.includes(lesson?._id) ? (
        <CheckCircleFilled style={{ marginTop: '13px' }} />
      ) : (
        <MinusCircleFilled style={{ marginTop: '13px' }} />
      ),
    }
  })

  const handleClick = (e) => setClicked(e.key)

  return (
    <div>
      <Drawer
        open={openDrawer}
        title='The Course Material'
        placement='left'
        onClose={() => setOpenDrawer(false)}
        style={{ backgroundColor: 'darkgrey' }}
      >
        <Button type='primary' block>
          {((completedLessons?.length / course?.lessons?.length) * 100).toFixed(0)}% Complete
        </Button>
        <Menu selectedKeys={[clicked]} items={items} onClick={handleClick} mode='vertical'></Menu>
      </Drawer>
    </div>
  )
}

export default SingleCourse
