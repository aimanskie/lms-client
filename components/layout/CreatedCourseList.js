import { Avatar, Tooltip, Badge } from 'antd'
import Link from 'next/link'
import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import usePath from '../../utils/path'
import { useRouter } from 'next/router'

const CreatedCourseList = ({ course, myStyle = {}, handlePublish = null, handleUnpublish = null }) => {
  return (
    <div className='media'>
      <Avatar size={80} src={course.image ? course.image.Location : '/course.png'} />
      {usePath(3) !== 'view' ? (
        <>
          <div className='row'>
            <div className='col pl-5'>
              <Link href={`/instructor/course/view/${course.slug}`} className='pointer mt-2 text-primary'>
                <h5 className='pt-2'>{course.name}</h5>
              </Link>
              <p style={{ marginTop: '-10px' }}>{course.lessons.length} Lessons</p>
              <MessagePublication course={course} myStyle={myStyle} />
            </div>
          </div>
          <div className='col mt-2'></div>
          <IconPublication course={course} />
        </>
      ) : (
        <>
          <div className='col'>
            <h5 className='mt-2 text-primary'>{course.name}</h5>
            <Badge count={course.category} style={{ fontSize: '12px', backgroundColor: '#03a9f4' }} />
          </div>

          <ChoicePublication course={course} handlePublish={handlePublish} handleUnpublish={handleUnpublish} />
        </>
      )}
    </div>
  )
}

const MessagePublication = ({ course, myStyle }) => {
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

const IconPublication = ({ course }) => {
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

const ChoicePublication = ({ course, handlePublish, handleUnpublish }) => {
  const router = useRouter()
  const { slug } = router.query

  return (
    <div className='d-flex pt-4 mr-4'>
      <Tooltip title='Edit'>
        <EditOutlined
          onClick={() => router.push(`/instructor/course/edit/${slug}`)}
          className='h5 pointer text-warning mr-4'
        />
      </Tooltip>

      {course?.lessons?.length < 2 ? (
        <Tooltip title='Min 2 lessons required to publish'>
          <QuestionOutlined className='h5 pointer text-danger' />
        </Tooltip>
      ) : course.published ? (
        <Tooltip title='Unpublish'>
          <CloseOutlined onClick={(e) => handleUnpublish(e, course._id)} className='h5 pointer text-danger' />
        </Tooltip>
      ) : (
        <Tooltip title='Publish'>
          <CheckOutlined onClick={(e) => handlePublish(e, course._id)} className='h5 pointer text-success' />
        </Tooltip>
      )}
    </div>
  )
}

export default CreatedCourseList
