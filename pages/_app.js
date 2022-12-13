import TopNav from '../components/TopNav.js'
import 'bootstrap/dist/css/bootstrap.min.css'
// import 'antd/dist/antd.css'
import '../public/global.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Provider } from '../context'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <Provider>
      <Head>
        <title>LMS</title>
        <link rel='icon' href='/favicon.png' />
      </Head>
      <ToastContainer position='top-center' autoClose={2500} hideProgressBar={true} />
      <TopNav />
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
