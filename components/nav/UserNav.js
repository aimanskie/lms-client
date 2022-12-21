import { useState, useEffect } from 'react'
import Link from 'next/link'

const UserNav = () => {
  const [current, setCurrent] = useState('')
  const [user, setUser] = useState({})

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname)
  }, [process.browser && window.location.pathname])

  useEffect(() => {
    const data = JSON.parse(window.localStorage.getItem('user'))
    setUser(data)
    //  if (user2) {
    //    axios(`/api/current-user1?id=${user2._id}`).then((res) => setUser(res.data))
    //  }
  }, [])

  return (
    <div className='nav flex-column nav-pills'>
      <Link href='/user' className={`nav-link ${current === '/user' && 'active'}`}>
        Your Courses
      </Link>
      {user?.role?.includes('Admin') && (
        <>
          <Link href='/user/admin' className={`nav-link ${current === '/user/admin' && 'active'}`}>
            Admin Page
          </Link>
          <Link href='/user/admin/admin' className={`nav-link ${current === '/user/admin/admin' && 'active'}`}>
            Admin Page2
          </Link>
        </>
      )}
    </div>
  )
}

export default UserNav
