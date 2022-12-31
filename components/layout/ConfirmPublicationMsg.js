import { Tooltip } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

export const MessagePublication = ({ course, myStyle }) => {
  return (
    <>
      {course.lessons.length < 2 ? (
        <p style={myStyle} className='text-warning'>
          At least 2 lessons are required to publish a course
        </p>
      ) : course.published ? (
        <p style={myStyle} className='text-success'>
          Your course is live
        </p>
      ) : (
        <p style={myStyle} className='text-success'>
          Your course is ready to be published
        </p>
      )}
    </>
  )
}

export const IconPublication = ({ course }) => {
  return (
    <>
      {course.published ? (
        <Tooltip title='Published'>
          <CheckCircleOutlined className='h5 pointer text-success align-self-center mr-5' />
        </Tooltip>
      ) : (
        <Tooltip title='Unpublished'>
          <CloseCircleOutlined className='h5 pointer text-warning align-self-center mr-5' />
        </Tooltip>
      )}
    </>
  )
}
