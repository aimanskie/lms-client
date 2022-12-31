import { List, Space, Avatar, Typography, Modal } from 'antd'
import { DragOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
const { Item } = List
const { Title } = Typography
import AddLessonForm from '../forms/AddLessonForm'

const ListLessons = ({
  index,
  setVisible,
  setCurrent,
  item,
  handleDrag = null,
  handleDrop = null,
  handleDelete = null,
  setOpen,
}) => {
  return (
    <>
      <Item>
        <Avatar className='mt-3 mr-3'>{index + 1}</Avatar>
        <Space draggable onDragStart={(e) => handleDrag(e, index)} onDrop={(e) => handleDrop(e, index)}>
          <DragOutlined className='pt-3 mr-5' style={{ fontSize: '20px', cursor: 'pointer' }} />
        </Space>
        <Item.Meta
          title={
            <Title level={5} className='mt-4 edit-lesson'>
              {item.title}
            </Title>
          }
        ></Item.Meta>
        <EditOutlined
          onClick={() => {
            setVisible({ editLesson: true, addLesson: false })
            setOpen(true)
            setCurrent(item)
          }}
          className='text-warning mr-5 pt-2'
        />
        <DeleteOutlined onClick={() => handleDelete(index)} className='text-danger mr-5 pt-2' />
      </Item>
      {/* <Modal>
        <AddLessonForm
          slug={slug}
          course={course}
          setCourse={setCourse}
          setVisible={setAddLessonVisible}
          windowSize={windowSize}
        />
      </Modal> */}
    </>
  )
}

export default ListLessons
