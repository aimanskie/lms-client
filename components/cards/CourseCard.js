import { useContext } from 'react'
import { Context } from '../../context'
import { Card, Badge } from 'antd'
import Link from 'next/link'
// import user from '../../../lms-server/models/user'
import { currencyFormatter } from '../../utils/helpers'

const { Meta } = Card

const CourseCard = ({ course }) => {
  const { _id: id, name, instructor, price, image, slug, paid, category } = course

  const {
    state: { user },
  } = useContext(Context)

  return (
    <>
      {user && !user.courses.includes(id) ? (
        <Link href={`/course/${slug}`}>
          <Card
            className='mb-4'
            cover={
              <img
                src={image && image.Location}
                alt={name}
                style={{ height: '200px', objectFit: 'cover' }}
                className='p-1'
              />
            }
          >
            <h2 className='font-weight-bold'>{name}</h2>

            <p>by {instructor.name}</p>
            <Badge count={category} style={{ backgroundColor: '#03a9f4' }} className='pb-2 mr-2' />

            <h4 className='pt-2'>
              {paid
                ? currencyFormatter({
                    amount: price,
                    currency: 'myr',
                  })
                : 'Free'}
            </h4>
          </Card>
        </Link>
      ) : (
        <Link href={`/user/course/${slug}`}>
          <Card
            className='mb-4'
            cover={
              <img
                src={image && image.Location}
                alt={name}
                style={{ height: '200px', objectFit: 'cover' }}
                className='p-1'
              />
            }
          >
            <h2 className='font-weight-bold'>{name}</h2>

            <p>by {instructor.name}</p>
            <Badge count={category} style={{ backgroundColor: '#03a9f4' }} className='pb-2 mr-2' />
            <div>You have Enrolled</div>
          </Card>
        </Link>
      )}
    </>
  )
}

export default CourseCard
