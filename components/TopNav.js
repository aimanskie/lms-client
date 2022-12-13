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
  const [current, setCurrent] = useState('/')

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

  return (
    <Menu theme='dark' mode='horizontal' selectedKeys={[current]} className='mb-0 w-100'>
      <Item key='/' onClick={(e) => setCurrent(e.key)} icon={<AppstoreOutlined />}>
        <Link href='/'>LMS</Link>
      </Item>
      <div style={{ position: 'relative', top: 0, right: 0 }}>
        {user && user.role && (user.role.includes('Admin') || user.role.includes('Instructor')) ? (
          <Item key='/instructor/course/create' onClick={(e) => setCurrent(e.key)} icon={<CarryOutOutlined />}>
            <Link href='/instructor/course/create'>Create Course</Link>
          </Item>
        ) : user !== null ? (
          <Item key='/user/new-instructor' onClick={(e) => setCurrent(e.key)} icon={<TeamOutlined />}>
            <Link href='/user/new-instructor'>Become Instructor</Link>
          </Item>
        ) : (
          <Item></Item>
        )}

        {user === null && (
          <>
            <Item key='/login' onClick={(e) => setCurrent(e.key)} icon={<LoginOutlined />}>
              <Link href='/login'>Login</Link>
            </Item>
            <Item key='/register' onClick={(e) => setCurrent(e.key)} icon={<UserAddOutlined />}>
              <Link href='/register'>Register</Link>
            </Item>
          </>
        )}

        {user && user.role && (user.role.includes('Admin') || user.role.includes('Instructor')) && (
          <Item key='/instructor' onClick={(e) => setCurrent(e.key)} icon={<TeamOutlined />}>
            <Link href='/instructor'>Instructor</Link>
          </Item>
        )}

        {user !== null && (
          <SubMenu icon={<CoffeeOutlined />} title={user && user.name}>
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
