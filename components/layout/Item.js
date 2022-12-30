import { useEffect, useContext, useState } from 'react'
import { Menu, Tooltip } from 'antd'
import Link from 'next/link'
import useWindowSize from '../../utils/windowSize'
import { Context } from '../../context'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

const NavItem = ({ route = '', title = '', setCurrent }) => {
  const { dispatch, windowSize } = useContext(Context)
  const [mediaStyle, setMediaStyle] = useState({})
  const router = useRouter()

  useEffect(() => {
    setMediaStyle(useWindowSize(windowSize))
  }, [windowSize])

  const logout = async () => {
    dispatch({ type: 'LOGOUT' })
    window.localStorage.removeItem('user')
    const { data } = await axios.get('/api/logout')
    toast.success(data.message)
    router.push('/login')
  }

  const handleClick = (e) => {
    if (title.includes('Logout')) return logout()
    setCurrent(e.key)
  }

  return (
    <Menu.Item key={route} onClick={handleClick} style={mediaStyle}>
      <Tooltip title={title} arrowPointAtCenter>
        <Link href={route}>
          <span>{title}</span>
        </Link>
      </Tooltip>
    </Menu.Item>
  )
}

export default NavItem
