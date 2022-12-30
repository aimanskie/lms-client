import { useEffect, useState } from 'react'
import axios from 'axios'
import InsideCard from '../layout/InsideCard'

const CourseCard = ({ course }) => {
  const [user, setUser] = useState(null)
  const { _id: id, name, instructor, price, image, slug, paid, category } = course

  useEffect(() => {
    const user2 = JSON.parse(window.localStorage.getItem('user'))
    if (user2) {
      axios(`/api/current-user1?id=${user2._id}`).then((res) => setUser(res.data))
    }
  }, [])

  return (
    <>
      {user?.courses?.includes(id) ? (
        <InsideCard
          route={`/user/course/${slug}`}
          image={image}
          name={name}
          instructor={instructor}
          category={category}
          id={id}
          paid={paid}
        />
      ) : (
        <InsideCard
          route={`/course/${slug}`}
          image={image}
          name={name}
          instructor={instructor}
          category={category}
          id={id}
          paid={paid}
        />
      )}
    </>
  )
}

export default CourseCard
