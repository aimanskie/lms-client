import { useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import { Avatar, Button, Modal, List } from 'antd'
import AddLessonForm from '../forms/AddLessonForm'
import Item from 'antd/lib/list/Item'
import ListLessons from './ListEditLessons'
import usePath from '../../utils/path'
import Info from './Information'

const CourseLessonList = ({ windowSize, slug, course, setCourse }) => {
  const path = usePath(3)
  const [editLessonVisible, setEditLessonVisible] = useState(false)
  const [addLessonVisible, setAddLessonVisible] = useState(false)

  const handleDelete = async (index) => {
    const answer = window.confirm('Are you sure you want to delete?')
    if (!answer) return
    let allLessons = values.lessons
    const removed = allLessons.splice(index, 1)
    setValues({ ...values, lessons: allLessons })
    const { data } = await axios.put(`/api/course/${slug}/${removed[0]._id}`)
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

  const handleDrag = (e, index) => {
    e.dataTransfer.setData('itemIndex', index)
  }

  return (
    <>
      <div className='col'>
        {course.lessons.length > 5 && (
          <div className='row add-lesson justify-content-center'>
            <Button
              onClick={() => setAddLessonVisible(true)}
              className='col-md-4 text-center'
              type='primary'
              shape='round'
              icon={<UploadOutlined />}
              size='large'
            >
              Add Lesson
            </Button>
          </div>
        )}
        {/* <div className='row'> */}
        {/* <span className='col'> */}
        {/* <h4>The course lessons</h4> */}
        <h4>{course?.lessons?.length} Lessons</h4>
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
              setCurrent={setCourse}
              setVisible={setEditLessonVisible}
              handleDelete={handleDelete}
              handleDrag={handleDrag}
              handleDrop={handleDrop}
            />
          )}
        ></List>
        <div className='row add-lesson justify-content-center'>
          <Button
            onClick={() => setVisible(true)}
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
        open={addLessonVisible}
        onCancel={() => setAddLessonVisible(false)}
        footer={null}
        width={windowSize.width}
        bodyStyle={{ height: windowSize.height }}
      >
        <AddLessonForm
          slug={slug}
          course={course}
          setCourse={setCourse}
          setVisible={setAddLessonVisible}
          windowSize={windowSize}
        />
      </Modal>
    </>
  )
}

export default CourseLessonList
