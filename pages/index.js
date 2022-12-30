import axios from 'axios'
import CourseCard from '../components/cards/CourseCard.js'
import Banner from '../components/layout/Banner.js'
const Index = ({ courses }) => {
  return (
    <>
      <Banner title='Online School' />
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
