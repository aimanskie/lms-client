import Link from 'next/link'
import { Card, Badge } from 'antd'
import { currencyFormatter } from '../../utils/helpers'

const InsideCard = ({ route, image, name, instructor, category, id, paid }) => {
  return (
    <Link href={route} style={{ textDecoration: 'none' }}>
      <Card
        className='mb-4'
        cover={<img src={image?.Location} alt={name} style={{ height: '35vh', objectFit: 'cover' }} className='p-1' />}
      >
        <h2 className='font-weight-bold'>{name}</h2>

        <p>by {instructor.name}</p>
        <Badge count={category} style={{ backgroundColor: '#03a9f4' }} className='pb-2 mr-2' />
        {id ? (
          <div>You have Enrolled</div>
        ) : (
          <h4 className='pt-2'>
            {paid
              ? currencyFormatter({
                  amount: price,
                  currency: 'myr',
                })
              : 'Free'}
          </h4>
        )}
      </Card>
    </Link>
  )
}

export default InsideCard
