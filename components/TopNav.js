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

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname)
  }, [process.browser && window.location.pathname])

  const logout = async () => {
    dispatch({ type: 'LOGOUT' })
    window.localStorage.removeItem('user')
    const { data } = await axios.get('/api/logout')
    toast(data.message)
    router.push('/login')
  }

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
  return (
    <Menu theme='dark' mode='horizontal' selectedKeys={[current]} className='mb-0'>
      <Item key='/' onClick={(e) => setCurrent(e.key)} icon={<AppstoreOutlined />} className='lms-name'>
        {/* <Tooltip title='Home'> */}
        <Link href='/'>
          <span className='text' style={mediaStyle}>
            LMS
          </span>
        </Link>
        {/* </Tooltip> */}
      </Item>
      <div className='home-icon'>
        {user && user.role && (user.role.includes('Admin') || user.role.includes('Instructor')) ? (
          <Item
            key='/instructor/course/create'
            onClick={(e) => setCurrent(e.key)}
            icon={<CarryOutOutlined />}
            tooltip='become instructor'
          >
            {/* <Tooltip title='Create Course'> */}
            <Link href='/instructor/course/create'>
              <span className='text' style={mediaStyle}>
                Create Course
              </span>
            </Link>
            {/* </Tooltip> */}
          </Item>
        ) : user !== null ? (
          <Item
            key='/user/new-instructor'
            onClick={(e) => setCurrent(e.key)}
            icon={<TeamOutlined />}
            tooltip='become instructor'
          >
            {/* <Tooltip title='Become Instructor'> */}
            <Link href='/user/new-instructor'>
              <span className='text' style={mediaStyle}>
                Become Instructor
              </span>
            </Link>
            {/* </Tooltip> */}
          </Item>
        ) : (
          <Item></Item>
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
              {/* </Tooltip> */}
            </Item>
            <Item key='/register' onClick={(e) => setCurrent(e.key)} icon={<UserAddOutlined />}>
              {/* <Tooltip title='Register'> */}
              <Link href='/register'>
                <span className='text' style={mediaStyle}>
                  Register
                </span>
              </Link>
              {/* </Tooltip> */}
            </Item>
          </>
        )}

        {user && user.role && (user.role.includes('Admin') || user.role.includes('Instructor')) && (
          <Item key='/instructor' onClick={(e) => setCurrent(e.key)} icon={<TeamOutlined />}>
            {/* <Tooltip title='Instructor'> */}
            <Link href='/instructor'>
              <span className='text' style={mediaStyle}>
                Instructor
              </span>
            </Link>
            {/* </Tooltip> */}
          </Item>
        )}

        {user !== null && (
          <SubMenu icon={<CoffeeOutlined />} title={user && user.name} style={mediaStyle}>
            <ItemGroup>
              <Item key='/user'>
                <Link href='/user'>Dashboard</Link>
              </Item>
              <Item onClick={logout}>Logout</Item>
            </ItemGroup>
          </SubMenu>
        )}
      </div>
    </Menu>
  )
}

export default TopNav
