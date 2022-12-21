import { useState, useEffect, useContext } from 'react'
import { Menu, Tooltip } from 'antd'
import Link from 'next/link'
import {
  AppstoreOutlined,
  CoffeeOutlined,
  LoginOutlined,
  UserAddOutlined,
  CarryOutOutlined,
  TeamOutlined,
  VerticalLeftOutlined,
  LogoutOutlined,
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
    if (windowSize.width < 900) {
      setMediaStyle({
        fontSize: '12px',
      })
    }
    if (windowSize.width < 560) {
      setMediaStyle({
        fontSize: '0px',
      })
    }
    if (windowSize.width > 900)
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

  return (
    <Menu theme='dark' mode='horizontal' selectedKeys={[current]} className='mb-0'>
      <Item key='/' onClick={(e) => setCurrent(e.key)} icon={<AppstoreOutlined />}>
        <Tooltip title='All Courses' arrowPointAtCenter>
          <Link href='/'>
            <span style={mediaStyle}>All Courses</span>
          </Link>
        </Tooltip>
      </Item>
      <div className='home-icon'>
        {user?.role?.includes('Instructor') && (
          <>
            <Item key='/instructor/course/create' onClick={(e) => setCurrent(e.key)} icon={<CarryOutOutlined />}>
              <Tooltip title='Create Courses' arrowPointAtCenter>
                <Link href='/instructor/course/create'>
                  <span className='text' style={mediaStyle}>
                    Create Course
                  </span>
                </Link>
              </Tooltip>
            </Item>
            <Item key='/instructor' onClick={(e) => setCurrent(e.key)} icon={<TeamOutlined />}>
              <Tooltip title='Instructor' arrowPointAtCenter>
                <Link href='/instructor'>
                  <span className='text' style={mediaStyle}>
                    Instructor
                  </span>
                </Link>
              </Tooltip>
            </Item>
          </>
        )}
        {user !== null && (
          <>
            <Item key='/user' style={mediaStyle} icon={<VerticalLeftOutlined />}>
              <Tooltip title='My Courses' arrowPointAtCenter>
                <Link href='/user'>My Courses</Link>
              </Tooltip>
            </Item>
            <SubMenu icon={<CoffeeOutlined />} title={user?.name} style={mediaStyle}>
              <Item onClick={logout} icon={<LogoutOutlined />}>
                Logout
              </Item>
            </SubMenu>
          </>
        )}

        {user === null && (
          <>
            <Item key='/login' onClick={(e) => setCurrent(e.key)} icon={<LoginOutlined />}>
              <Tooltip title='Login' arrowPointAtCenter>
                <Link href='/login'>
                  <span className='text' style={mediaStyle}>
                    Login
                  </span>
                </Link>
              </Tooltip>
            </Item>
            <Item key='/register' onClick={(e) => setCurrent(e.key)} icon={<UserAddOutlined />}>
              <Tooltip title='Register' arrowPointAtCenter>
                <Link href='/register'>
                  <span className='text' style={mediaStyle}>
                    Register
                  </span>
                </Link>
              </Tooltip>
            </Item>
          </>
        )}
      </div>
    </Menu>
  )
}

export default TopNav
