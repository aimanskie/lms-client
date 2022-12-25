import { useState, useEffect } from 'react'
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd'
import UserRoute from '../../../components/routes/UserRoute'
import axios from 'axios'
import { SyncOutlined } from '@ant-design/icons'

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}
const Admin = () => {
  const [form] = Form.useForm()
  const [data, setData] = useState({})
  const [editingKey, setEditingKey] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const isEditing = (record) => record.key === editingKey
  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      age: '',
      email: '',
      ...record,
    })
    setEditingKey(record.key)
  }

  useEffect(() => {
    setLoading(true)
    axios('/api/user')
      .then((res) => {
        const data = res.data.map((user, idx) => {
          const { name, email, _id, role } = user
          return { key: _id, name, roles: role.join(','), email }
        })
        setData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }, [])

  const cancel = () => {
    setEditingKey('')
  }
  const save = async (key) => {
    try {
      const row = await form.validateFields()
      const newData = [...data]
      const index = newData.findIndex((item) => key === item.key)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row,
        })
        setData(newData)
        setEditingKey('')
      } else {
        newData.push(row)
        setData(newData)
        setEditingKey('')
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }
  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      width: '25%',
      editable: true,
    },
    {
      title: 'roles',
      dataIndex: 'roles',
      width: '30%',
      editable: true,
    },
    {
      title: 'email',
      dataIndex: 'email',
      width: '20%',
      editable: true,
    },
    {
      title: 'edit',
      dataIndex: 'edit',
      render: (_, record) => {
        const editable = isEditing(record)
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title='Sure to cancel?' onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        )
      },
    },
  ]

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  return (
    <UserRoute>
      {loading && <SyncOutlined spin className='d-flex justify-content-center display-1 text-danger p-5' />}
      <h1 className='jumbotron text-center square w-100'>Admin</h1>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName='editable-row'
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </UserRoute>
  )
}
export default Admin
