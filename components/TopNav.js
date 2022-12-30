import { useContext, useState, useEffect } from 'react'
import { Context } from '../context'
import { Menu } from 'antd'
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
import NavItem from './layout/Item'

const TopNav = () => {
  const [current, setCurrent] = useState('')

  const {
    state: { user },
  } = useContext(Context)

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname)
  }, [process.browser && window.location.pathname])

  return (
    <Menu theme='dark' mode='horizontal' selectedKeys={[current]} className='mb-0'>
      <NavItem route='/' title='All Courses' setCurrent={setCurrent} />
      <div className='home-icon'>
        {user?.role?.includes('Instructor') && (
          <>
            <NavItem route='/instructor/course/create' title='Create Courses' setCurrent={setCurrent} />
            <NavItem route='/instructor' title='Instructor' setCurrent={setCurrent} />
          </>
        )}
        {user !== null && (
          <>
            <NavItem route='/user' title='Enrolled Courses' current={current} setCurrent={setCurrent} />
            <NavItem title={`Logout, ${user?.name}`} setCurrent={setCurrent} />
          </>
        )}

        {user === null && (
          <>
            <NavItem route='/login' title='Login' setCurrent={setCurrent} />
            <NavItem route='/register' title='Register' current={current} setCurrent={setCurrent} />
          </>
        )}
      </div>
    </Menu>
  )
}

export default TopNav
