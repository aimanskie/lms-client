import { List, Space, Avatar, Typography } from 'antd'
import { DragOutlined, DeleteOutlined } from '@ant-design/icons'
const { Item } = List
const { Title } = Typography

const ListEditLessons = ({ index, setVisible, setCurrent, item, handleDrag, handleDrop, handleDelete }) => {
  return (
    <>
      <Item>
        <Space draggable onDragStart={(e) => handleDrag(e, index)} onDrop={(e) => handleDrop(e, index)}>
          <Avatar className='mt-3 mr-3'>{index + 1}</Avatar>
          <DragOutlined className='pt-3 mr-5' style={{ fontSize: '20px', cursor: 'pointer' }} />
        </Space>
        <Item.Meta
          onClick={() => {
            setVisible(true)
            setCurrent(item)
          }}
          title={
            <Title level={5} className='mt-4 edit-lesson'>
              {item.title}
            </Title>
          }
          style={{ cursor: 'pointer', color: 'blue' }}
        ></Item.Meta>
        <DeleteOutlined onClick={() => handleDelete(index)} className='text-danger mr-5 pt-2' />
      </Item>
    </>
  )
}

export default ListEditLessons
