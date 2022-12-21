import { useState, useEffect, useContext } from 'react'
import { Menu } from 'antd'
import Link from 'next/link'
import {
  AppstoreOutlined,
  CoffeeOutlined,
  LoginOutlined,
  UserAddOutlined,
  CarryOutOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { Context } from '../context'
import axios from 'axios'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

const { Item, SubMenu, ItemGroup } = Menu

const TopNav = () => {
  const [current, setCurrent] = useState('')
  const [windowSize, setWindowSize] = useState({ width: undefined, height: undefined })
  const [mediaStyle, setMediaStyle] = useState({})

  const {
    state: { user },
    dispatch,
  } = useContext(Context)
  const router = useRouter()
  const { slug } = router.query

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname)
  }, [process.browser && window.location.pathname])

  console.log(current)

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (windowSize.width < 800) {
      setMediaStyle({
        fontSize: '12px',
      })
    }
    if (windowSize.width < 390) {
      setMediaStyle({
        fontSize: '0px',
      })
    }
    if (windowSize.width > 800)
      setMediaStyle({
        fontSize: '19px',
      })
  }, [windowSize])

  const logout = async () => {
    dispatch({ type: 'LOGOUT' })
    window.localStorage.removeItem('user')
    const { data } = await axios.get('/api/logout')
    toast.success(data.message)
    router.push('/login')
  }
  // console.log(`/user/course/${slug}`)
  return (
    <Menu theme='dark' mode='horizontal' selectedKeys={[current]} className='mb-0'>
      <Item key='/' onClick={(e) => setCurrent(e.key)} icon={<AppstoreOutlined />}>
        {/* <Tooltip title='Home'> */}
        <Link href='/'>
          <span style={mediaStyle}>All Courses</span>
        </Link>
        {/* </Tooltip> */}
      </Item>
      <div className='home-icon'>
        {user?.role?.includes('Instructor') && (
          <>
            <Item key='/instructor/course/create' onClick={(e) => setCurrent(e.key)} icon={<CarryOutOutlined />}>
              <Link href='/instructor/course/create'>
                <span className='text' style={mediaStyle}>
                  Create Course
                </span>
              </Link>
            </Item>
            <Item key='/instructor' onClick={(e) => setCurrent(e.key)} icon={<TeamOutlined />}>
              <Link href='/instructor'>
                <span className='text' style={mediaStyle}>
                  Instructor
                </span>
              </Link>
            </Item>
            {/* {user !== null && ( */}
            {/* <div style={mediaStyle}> */}
            <Item key='/user' style={mediaStyle}>
              <Link href='/user'>Your Courses</Link>
            </Item>
            <SubMenu icon={<CoffeeOutlined />} title={user?.name} style={mediaStyle}>
              <Item onClick={logout}>Logout</Item>
            </SubMenu>
            {/* </div> */}
            {/* )} */}
          </>
        )}

        {user === null && (
          <>
            <Item key='/login' onClick={(e) => setCurrent(e.key)} icon={<LoginOutlined />}>
              {/* <Tooltip title='Login'> */}
              <Link href='/login'>
                <span className='text' style={mediaStyle}>
                  Login
                </span>
              </Link>
            </Item>
            <Item key='/register' onClick={(e) => setCurrent(e.key)} icon={<UserAddOutlined />}>
              <Link href='/register'>
                <span className='text' style={mediaStyle}>
                  Register
                </span>
              </Link>
            </Item>
          </>
        )}
      </div>
    </Menu>
  )
}

export default TopNav
