const usePath = (index) => {
  const { pathname } = new URL(window.location.href)
  const pathArr = pathname.split('/')

  return pathArr[index]
}

export default usePath
