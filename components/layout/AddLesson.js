import { UploadOutlined } from '@ant-design/icons'
import { Avatar, Button, Modal, List } from 'antd'
import AddLessonForm from '../forms/AddLessonForm'
import Item from 'antd/lib/list/Item'

const AddLesson = ({ visible, setVisible, windowSize, slug, course, setCourse }) => {
  return (
    <>
      <Modal
        centered
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={windowSize.width}
        bodyStyle={{ height: windowSize.height }}
      >
        <AddLessonForm
          slug={slug}
          course={course}
          setCourse={setCourse}
          setVisible={setVisible}
          windowSize={windowSize}
        />
      </Modal>
      <div className='col'>
        <div className='row'>
          <span className='col'>
            <h4>The course lessons</h4>
          </span>
          <span className='col text-center'>
            <h6>total {course?.lessons?.length} Lessons</h6>
          </span>
        </div>
        <div>
          <List
            itemLayout='horizontal'
            dataSource={course?.lessons}
            renderItem={(item, index) => (
              <Item>
                <Item.Meta avatar={<Avatar>{index + 1}</Avatar>} title={item.title}></Item.Meta>
              </Item>
            )}
          ></List>
        </div>
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
    </>
  )
}

export default AddLesson
