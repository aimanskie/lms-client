import { useEffect, useState } from 'react'

const windowStyle = ({ windowSize }) => {
  console.log(windowSize)
  const [mediaQuery, setMediaQuery] = useState({ width: '30vh', height: '80vh', overflow: 'scroll' })
  const [mediaQuery2, setMediaQuery2] = useState({
    fontSize: '50px',
    textAlign: 'center',
    alignItems: 'center',
  })
  useEffect(() => {
    if (windowSize.width < 600)
      setMediaQuery({
        width: '15vh',
        height: '100vh',
        overflow: 'scroll',
        fontSize: '14px',
      })
    if (windowSize.width < 390) {
      setMediaQuery({
        width: '13vh',
        height: '100vh',
        overflow: 'scroll',
        fontSize: '9px',
      })
      setMediaQuery2({
        paddingTop: '50px',
        fontSize: '20px',
        textAlign: 'center',
        alignItems: 'center',
      })
    }
    if (windowSize.width > 600) {
      setMediaQuery({
        width: '30vh',
        height: '100vh',
        overflow: 'scroll',
      })
      setMediaQuery2({
        paddingTop: '100px',
        fontSize: '50px',
        textAlign: 'center',
        alignItems: 'center',
      })
    }
    if (windowSize.width > 1200)
      setMediaQuery({
        width: '30vh',
        height: '100vh',
        overflow: 'scroll',
        fontSize: '22px',
      })
  }, [windowSize])
  return { mediaQuery, mediaQuery2 }
}

export default windowStyle
