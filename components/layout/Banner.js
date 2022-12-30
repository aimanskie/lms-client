const Banner = ({ title, small = null }) => {
  return (
    <>
      {!small ? (
        <h1 className='jumbotron text-center w-100'>{title}</h1>
      ) : (
        <h3 className='jumbotron text-center p-3'>{title}</h3>
      )}
    </>
  )
}

export default Banner
