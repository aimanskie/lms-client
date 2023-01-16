import { useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import { Avatar, Button, Modal, List } from 'antd'
import AddLessonForm from '../forms/AddLessonForm'
import Item from 'antd/lib/list/Item'
import ListLessons from './ListEditLessons'
import usePath from '../../utils/path'
import Info from './Information'
import axios from 'axios'
import { toast } from 'react-toastify'

const CourseLessonList = ({ windowSize, slug, course, setCourse }) => {
  // const path = usePath(3)
  const [visible, setVisible] = useState({ addLesson: undefined, editLesson: undefined })
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState({})

  const handleDelete = async (index) => {
    const answer = window.confirm('Are you sure you want to delete?')
    if (!answer) return
    console.log(course)
    let allLessons = course.lessons
    const removed = allLessons.splice(index, 1)
    // setValues({ ...values, lessons: allLessons })
    setCourse({ ...course, lessons: allLessons })
    const { data } = await axios.put(`/api/course/${slug}/${removed[0]._id}`)
  }

  const handleDrop = async (e, index) => {
    const movingItemIndex = e.dataTransfer.getData('itemIndex')
    const targetItemIndex = index
    let allLessons = course.lessons

    let movingItem = allLessons[movingItemIndex]
    allLessons.splice(movingItemIndex, 1)
    allLessons.splice(targetItemIndex, 0, movingItem)

    // setValues({ ...values, lessons: [...allLessons] })
    setCourse({ ...course, lessons: [...allLessons] })
    const { data } = await axios.put(`/api/course/${slug}`, {
      ...course,
      image: course.image,
    })
    toast.success('Lessons rearranged successfully')
  }

  const handleDrag = (e, index) => {
    e.dataTransfer.setData('itemIndex', index)
  }

  return (
    <>
      <div className='col'>
        {course?.lessons?.length > 5 && (
          <div className='row add-lesson justify-content-center'>
            <Button
              onClick={() => {
                setVisible({ addLesson: true, editLesson: false })
                setOpen(true)
              }}
              className='col-md-4 text-center'
              type='primary'
              shape='round'
              icon={<UploadOutlined />}
              size='large'
              style={{ marginBottom: 5 }}
            >
              Add Lesson
            </Button>
          </div>
        )}
        {/* <div className='row'> */}
        {/* <span className='col'> */}
        {/* <h4>The course lessons</h4> */}
        {/* </span> */}
        <Info message='Edit the lessons or Delete' desc='And rearrange the lessons by drag and drop' />
        {/* </div> */}
        <List
          onDragOver={(e) => e.preventDefault()}
          itemLayout='horizontal'
          dataSource={course?.lessons}
          renderItem={(item, index) => (
            <ListLessons
              item={item}
              index={index}
              setCurrent={setCurrent}
              setVisible={setVisible}
              handleDelete={handleDelete}
              handleDrag={handleDrag}
              handleDrop={handleDrop}
              setOpen={setOpen}
              // visible={visible}
              // course={course}
            />
          )}
        ></List>
        <div className='row add-lesson justify-content-center'>
          <Button
            onClick={() => {
              setVisible({ addLesson: true, editLesson: false })
              setOpen(true)
            }}
            className='col-md-4 text-center'
            type='primary'
            shape='round'
            icon={<UploadOutlined />}
            size='large'
          >
            Add Lesson
          </Button>
        </div>
      </div>
      <Modal
        centered
        open={open}
        onCancel={() => {
          setVisible({ addLesson: false, editLesson: false })
        }}
        footer={null}
        width={windowSize.width}
        bodyStyle={{ height: windowSize.height }}
      >
        <AddLessonForm
          slug={slug}
          course={visible.addLesson ? course : current}
          setCourse={visible.addLesson ? setCourse : setCurrent}
          visible={visible}
          setVisible={setVisible}
          windowSize={windowSize}
          setOpen={setOpen}
          // setCurrent={setCurrent}
          current={current}
          courses={course}
          setCourses={setCourse}
        />
      </Modal>
    </>
  )
}

export default CourseLessonList
