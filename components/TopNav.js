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
  // const [user1, setUser1] = useState(null)
  // const [logOut, setLogOut] = useState(null)

  const {
    state: { user },
    dispatch,
  } = useContext(Context)
  const router = useRouter()

  useEffect(() => {
    // axios('/api/current-user1')
    //   .then((data) => {
    //     const { role } = data.data
    //     setUser1(role)
    //   })
    //   .catch((err) => console.log(err))

    process.browser && setCurrent(window.location.pathname)
  }, [process.browser && window.location.pathname])

  // useEffect(() => {
  //   if (user.role.includes('Admin') || user.role.includes('Instructor')) {
  //     setShow(true)
  //   }
  // }, [user.role])

  const logout = async () => {
    dispatch({ type: 'LOGOUT' })
    window.localStorage.removeItem('user')
    const { data } = await axios.get('/api/logout')
    toast(data.message)
    // setUser1(null)
    router.push('/login')
  }

  return (
    <Menu theme='dark' mode='horizontal' selectedKeys={[current]} className='mb-2'>
      <Item key='/' onClick={(e) => setCurrent(e.key)} icon={<AppstoreOutlined />}>
        <Link href='/'>
          <a>LMS</a>
        </Link>
      </Item>

      {user && user.role && (user.role.includes('Admin') || user.role.includes('Instructor')) ? (
        <Item key='/instructor/course/create' onClick={(e) => setCurrent(e.key)} icon={<CarryOutOutlined />}>
          <Link href='/instructor/course/create'>
            <a>Create Course</a>
          </Link>
        </Item>
      ) : user !== null ? (
        <Item key='/user/new-instructor' onClick={(e) => setCurrent(e.key)} icon={<TeamOutlined />}>
          <Link href='/user/new-instructor'>
            <a>Become Instructor</a>
          </Link>
        </Item>
      ) : <Item></Item>
    }

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
