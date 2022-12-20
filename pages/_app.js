import TopNav from '../components/TopNav.js'
import 'bootstrap/dist/css/bootstrap.min.css'
// import 'antd/dist/antd.css'
import '../public/global.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Provider } from '../context'
import Head from 'next/head'
import { Layout } from 'antd'

function MyApp({ Component, pageProps }) {
  return (
    <Provider>
      <Layout style={{ height: '100vh' }}>
        <ToastContainer position='top-right' autoClose={2500} hideProgressBar={true} theme={'dark'} />
        <Head>
          <title>LMS</title>
          <meta name='description' content='A simple Online Learning site' />
          <meta name='viewport' content='width=device-width, initial-scale=1.0' />
          <meta property='og:title' content='Online Learning' />
          <meta property='og:type' content='website' />
          <meta property='og:url' content='https://www.assohwah.com' />
          <meta property='og:description' content='A simple Online Learning site' />
          <meta property='og:image' content='https://dl.dropbox.com/s/wy8lx81marbnriv/DR%20ATIYAH.png?dl=0' />
          <meta name='Atiyah Azmi' content='LMS' />
          <link rel='icon' href='/favicon.png' />
        </Head>
        <TopNav />
        <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}

export default MyApp
