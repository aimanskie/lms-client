import { Select } from 'antd'

const Price = ({ setValues, values }) => {
  const children = []
  for (let i = 9.99; i <= 510.99; i += 10) {
    children.push(<Option key={i.toFixed(2)}>RM {i.toFixed(2)}</Option>)
  }
  return (
    <Select
      defaultValue='RM 9.99'
      onChange={(v) => setValues({ ...values, price: v })}
      tokenSeparators={[,]}
      size='large'
      style={{ width: '20vw' }}
    >
      {children}
    </Select>
  )
}

export default Price
