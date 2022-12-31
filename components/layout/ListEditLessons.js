import { List, Space, Avatar, Typography } from 'antd'
import { DragOutlined, DeleteOutlined } from '@ant-design/icons'
const { Item } = List
const { Title } = Typography

const ListLessons = ({
  index,
  setVisible,
  setCurrent,
  item,
  handleDrag = null,
  handleDrop = null,
  handleDelete = null,
  path = null,
}) => {
  return (
    <>
      <Item>
        <Avatar className='mt-3 mr-3'>{index + 1}</Avatar>
        {path !== 'view' && (
          <Space draggable onDragStart={(e) => handleDrag(e, index)} onDrop={(e) => handleDrop(e, index)}>
            <DragOutlined className='pt-3 mr-5' style={{ fontSize: '20px', cursor: 'pointer' }} />
          </Space>
        )}
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
        {path !== 'view' && <DeleteOutlined onClick={() => handleDelete(index)} className='text-danger mr-5 pt-2' />}
      </Item>
    </>
  )
}

export default ListLessons
