import { Avatar, Tooltip, Badge } from 'antd'
import Link from 'next/link'
import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import usePath from '../../utils/path'
import { useRouter } from 'next/router'
import { IconPublication, MessagePublication } from './ConfirmPublicationMsg'
import { PublicationCheck } from './PublicationCheck'
import { useState } from 'react'

const CreatedCourseAvatar = ({
  windowSize,
  course,
  myStyle = {},
  handlePublish = null,
  handleUnpublish = null,
  setCourse,
}) => {
  // const [editCourseVis, setEditCourseVis] = useState(false)

  return (
    <div className='media'>
      <Avatar size={80} src={course?.image ? course.image.Location : '/course.png'} />
      {usePath(3) !== 'view' ? (
        <>
          <div className='row'>
            <div className='col pl-5'>
              <Link href={`/instructor/course/view/${course.slug}`} className='pointer text-primary'>
                <h5 className='pt-2'>{course.name}</h5>
              </Link>
              <p style={{ marginTop: '-10px' }}>{course.lessons.length} Lessons</p>
              <MessagePublication course={course} myStyle={myStyle} />
            </div>
          </div>
          <div className='col'></div>
          <IconPublication course={course} />
        </>
      ) : (
        <>
          <div className='col'>
            <h5 className='mt-2 text-primary'>{course.name}</h5>
            {/* Category Badge */}
            <Badge count={course.category} style={{ fontSize: '12px', backgroundColor: '#03a9f4' }} />
          </div>

          <PublicationCheck
            windowSize={windowSize}
            course={course}
            handlePublish={handlePublish}
            handleUnpublish={handleUnpublish}
            setCourse={setCourse}
            // editCourseVis={editCourseVis}
            // setEditCourseVis={setEditCourseVis}
          />
        </>
      )}
    </div>
  )
}

export default CreatedCourseAvatar
