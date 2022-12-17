import { useEffect, useState } from 'react'
import { Card, Badge } from 'antd'
import Link from 'next/link'
import { currencyFormatter } from '../../utils/helpers'
import axios from 'axios'

const CourseCard = ({ course }) => {
  const [user, setUser] = useState(null)

  const { _id: id, name, instructor, price, image, slug, paid, category } = course

  useEffect(() => {
    storageWindow()
  }, [])

  const storageWindow = async () => {
    const user2 = JSON.parse(window.localStorage.getItem('user'))
    if (user2) {
      const user1 = await axios(`/api/current-user1?id=${user2._id}`)
      setUser(user1.data)
    }
  }

  return (
    <>
      {user && user.courses && user.courses.includes(id) ? (
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
      ) : (
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
      )}
    </>
  )
}

export default CourseCard
