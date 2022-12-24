import { currencyFormatter } from '../../utils/helpers.js'
import { Badge, Button } from 'antd'
import ReactPlayer from 'react-player'
import { LoadingOutlined, SafetyOutlined } from '@ant-design/icons'

const SingleCourseJumbotron = ({
  course,
  showModal,
  setShowModal,
  setPreview,
  loading,
  user,
  handlePaidEnrollment,
  handleFreeEnrollment,
  enrolled,
}) => {
  const { name, description, instructor, updatedAt, lessons, image, price, paid, category } = course

  return (
    <div className='jumbotron bg-primary square'>
      <div className='row'>
        <div className='col-md-8'>
          {/* title */}
          <h1 className='text-light font-weight-bold'>{name}</h1>
          {/* description */}
          <p className='lead'>{description?.substring(0, 160)}</p>
          {/* category */}
          <Badge count={category} style={{ backgroundColor: '#03a9f4' }} className='pb-4 mr-2' />
          {/* author */}
          <p>Created by {instructor.name}</p>
          {/* updated at */}
          <p>Last updated {new Date(updatedAt).toLocaleDateString()}</p>
          {/* price */}
          <h4 className='text-light'>
            {paid
              ? currencyFormatter({
                  amount: price,
                  currency: 'myr',
                })
              : 'Free'}
          </h4>
        </div>
        <div className='col-md-4'>
          {/* {JSON.stringify(lessons[0])} */}
          {/* show video preview or course image */}
          {lessons[0]?.video?.Location ? (
            <div
              onClick={() => {
                setPreview(lessons[0].video.Location)
                setShowModal(!showModal)
              }}
            >
              <ReactPlayer
                className='react-player-div'
                url={lessons[0].video.Location}
                light={image && image.Location}
                width='100%'
                height='225px'
              />
            </div>
          ) : (
            <>
              <img src={image?.Location} alt={name} className='img img-fluid' />
            </>
          )}

          {loading ? (
            <div className='d-flex justify-content-center mt-3'>
              <LoadingOutlined className='h1 text-danger' />
            </div>
          ) : (
            <Button
              className='mb-3 mt-3'
              type='dashed'
              shape='round'
              icon={<SafetyOutlined />}
              size='large'
              open={!loading}
              onClick={paid ? handlePaidEnrollment : handleFreeEnrollment}
            >
              {user ? (enrolled.status ? 'Go to course' : 'Enroll') : 'Login to enroll'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SingleCourseJumbotron
