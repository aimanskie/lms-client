import axios from 'axios'
import CourseCard from '../components/cards/CourseCard.js'
import Head from 'next/head'

const Index = ({ courses }) => {
  return (
    <>
      <Head>
        <title>LMS</title>
        <link rel='icon' href='/favicon.png' />
      </Head>
      <h1 className='jumbotron text-center bg-primary square'>Online School</h1>
      <div className='container-fluid'>
        <div className='row'>
          {courses.map((course) => (
            <div key={course._id} className='col-md-4'>
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const { data } = await axios.get(`${process.env.API}/courses`)
  return {
    props: {
      courses: data,
    },
  }
}

export default Index
