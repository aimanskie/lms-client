import { useReducer, createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

const intialState = {
  user: null,
}

const Context = createContext()

const rootReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload }
    case 'LOGOUT':
      return { ...state, user: null }
    default:
      return state
  }
}

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, intialState)
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  })

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

  const router = useRouter()

  useEffect(() => {
    dispatch({
      type: 'LOGIN',
      payload: JSON.parse(window.localStorage.getItem('user')),
    })
  }, [])

  axios.interceptors.response.use(
    function (response) {
      return response
    },
    function (error) {
      let res = error.response
      if ((res.status === 401 || res.status === 404) && res.config && !res.config.__isRetryRequest) {
        return new Promise((resolve, reject) => {
          axios
            .get('/api/logout')
            .then((data) => {
              console.log('/401 error > logout')
              dispatch({ type: 'LOGOUT' })
              window.localStorage.removeItem('user')
              router.push('/login')
            })
            .catch((err) => {
              console.log('AXIOS INTERCEPTORS ERR', err)
              reject(error)
            })
        })
      }
      return Promise.reject(error)
    }
  )

  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get('/api/csrf-token')
      axios.defaults.headers['X-CSRF-Token'] = data.getCsrfToken
    }
    getCsrfToken()
  }, [])

  const value = {
    state,
    dispatch,
    windowSize,
  }

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export { Context, Provider }
