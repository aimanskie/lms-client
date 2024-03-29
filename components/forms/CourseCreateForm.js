import { Select, Button, Avatar, Badge } from 'antd'
import Banner from '../layout/Banner'
import Price from '../layout/PriceRange'
const { Option } = Select

const CourseCreateForm = ({
  handleSubmit,
  handleImage,
  handleChange,
  values,
  setValues,
  preview,
  uploadButtonText,
  handleImageRemove = (f) => f,
  editPage = false,
  setEditCourseVisible,
}) => {
  return (
    <>
      {editPage && <Banner title='Edit Course' small='small' />}
      {values && (
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <input
              type='text'
              name='name'
              className='form-control'
              placeholder='Name'
              value={values.name}
              onChange={handleChange}
            />
          </div>

          <div className='form-group'>
            <textarea
              name='description'
              cols='7'
              rows='7'
              value={values.description}
              className='form-control'
              onChange={handleChange}
            ></textarea>
          </div>

          <div className='form-row'>
            <div className='col'>
              <div className='form-group'>
                <Select
                  style={{ width: '100%' }}
                  size='large'
                  value={values.paid}
                  onChange={(v) => setValues({ ...values, paid: v, price: 0 })}
                >
                  <Option value={true}>Paid</Option>
                  <Option value={false}>Free</Option>
                </Select>
              </div>
            </div>

            {values.paid && (
              // <div className='form-group'>
              <Price setValues={setValues} values={values} />
              // </div>
            )}
          </div>

          <div className='form-group'>
            <input
              type='text'
              name='category'
              className='form-control'
              placeholder='Category'
              value={values.category}
              onChange={handleChange}
            />
          </div>

          <div className='form-row'>
            <div className='col'>
              <div className='form-group'>
                <label className='btn btn-outline-secondary btn-block text-left'>
                  {uploadButtonText}
                  <input type='file' name='image' onChange={handleImage} accept='image/*' hidden />
                </label>
              </div>
            </div>

            {preview && (
              <Badge count='X' onClick={handleImageRemove} className='pointer'>
                <Avatar width={200} src={preview} />
              </Badge>
            )}

            {editPage && values.image && <Avatar width={200} src={values.image.Location} />}
          </div>

          <div className='row'>
            <div className='col' style={{ textAlign: 'center' }}>
              <Button
                onClick={() => setEditCourseVisible(false)}
                type='default'
                size='large'
                shape='round'
                style={{ marginRight: 5 }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={values.loading || values.uploading}
                className='btn btn-primary'
                loading={values.loading}
                type='primary'
                size='large'
                shape='round'
                // style={{ textAlign: 'center', justifyContent: 'center' }}
              >
                {values.loading ? 'Saving...' : 'Save & Continue'}
              </Button>
            </div>
          </div>
        </form>
      )}
    </>
  )
}

export default CourseCreateForm
