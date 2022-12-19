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
      <Layout>
        <Head>
          <meta name='viewport' content='width=device-width, initial-scale=1.0' />
          <meta name='description' content='A simple Online Learning site' />
          <meta property='og:title' content='Online Learning' />
          <meta property='og:type' content='website' />
          <meta property='og:url' content='https://www.assohwah.com' />
          <meta property='og:description' content='A simple Online Learning site' />
          <meta property='og:image' content='favicon.png' />
          <meta name='Atiyah Azmi' content='LMS' />
          <title>LMS</title>
          <link rel='icon' href='/favicon.png' />
          {/* <link rel='icon' href='/favicon.svg' type='image/svg+xml' /> */}
          {/* <link rel='apple-touch-icon' href='/apple-touch-icon.png' /> */}
        </Head>
        <ToastContainer position='top-center' autoClose={2500} hideProgressBar={true} />
        <TopNav />
        <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}

export default MyApp
