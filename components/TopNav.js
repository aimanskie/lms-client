import { useState, useEffect, useContext } from 'react'
import { Menu } from 'antd'
import Link from 'next/link'
import {
  AppstoreOutlined,
  CoffeeOutlined,
  LoginOutlined,
  LogoutOutlined,
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

  const { state, dispatch } = useContext(Context)
  const { user } = state
  console.log(user)
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
    <Menu theme='dark' mode='horizontal' selectedKeys={[current]} className='mb-2' style={{ dispay: 'block' }}>
      <Item key='/' onClick={(e) => setCurrent(e.key)} icon={<AppstoreOutlined />}>
        <Link href='/'>
          <a>LMS</a>
        </Link>
      </Item>

      {user && user.role && (user.role.includes('Admin') || user.role.includes('Instructor')) && (
        <Item key='/instructor/course/create' onClick={(e) => setCurrent(e.key)} icon={<CarryOutOutlined />}>
          <Link href='/instructor/course/create'>
            <a>Create Course</a>
          </Link>
        </Item>
      )} 
      {/* // : (
      //   user !== null && (
      //     <Item key='/user/new-instructor' onClick={(e) => setCurrent(e.key)} icon={<TeamOutlined />}>
      //       <Link href='/user/new-instructor'>
      //         <a>Become Instructor</a>
      //       </Link>
      //     </Item>
      //   )
      // )} */}

      {user === null && (
        <>
          <Item
            className='text-end'
            key='/login'
            onClick={(e) => setCurrent(e.key)}
            icon={<LoginOutlined />}
            style={{ float: 'right' }}
          >
            <Link href='/login'>
              <a>Login</a>
            </Link>
          </Item>
          <Item
            /* className='text-end' */
            key='/register'
            onClick={(e) => setCurrent(e.key)}
            icon={<UserAddOutlined />}
            style={{ float: 'right' }}
          >
            <Link href='/register'>
              <a>Register</a>
            </Link>
          </Item>
        </>
      )}

      {user !== null && (
        <SubMenu icon={<CoffeeOutlined />} title={user && user.name} style={{ float: 'right' }}>
          <ItemGroup>
            <Item key='/user'>
              <Link href='/user'>
                <a>Dashboard</a>
              </Link>
            </Item>
            <Item onClick={logout}>Logout</Item>
          </ItemGroup>
        </SubMenu>
      )}

      {user && user.role && (user.role.includes('Admin') || user.role.includes('Instructor')) && (
        <Item key='/instructor' onClick={(e) => setCurrent(e.key)} icon={<TeamOutlined />} style={{ float: 'right' }}>
          <Link href='/instructor'>
            <a>Instructor</a>
          </Link>
        </Item>
      )}
    </Menu>
  )
}

export default TopNav
