const useWindowSize = ({ width, height }) => {
  if (width < 900) return { fontSize: '12px' }
  if (width < 560) return { fontSize: '3px' }
  if (width > 900) return { fontSize: '19px' }
}

export default useWindowSize
