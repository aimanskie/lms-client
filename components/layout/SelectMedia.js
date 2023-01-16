import { Select, Input, Button } from 'antd'
import { CloseCircleFilled } from '@ant-design/icons'
import usePath from '../../utils/path'

const SelectMedia = ({
  placeholderSelect,
  placeholderURL,
  labelMedia,
  labelURL,
  handleSelect,
  media,
  textBtn = '',
  handleOnChange,
  handleRemove = null,
  uploading,
  values,
  handleURL,
  current,
  hostname,
  visible,
}) => {
  // const editPath = usePath(3)
  console.log(visible)
  return (
    <>
      <Select
        placeholder={placeholderSelect}
        style={{
          width: '100%',
          marginTop: '10px',
          textAlign: 'center',
        }}
        onChange={handleSelect}
        options={[
          {
            value: true,
            label: labelMedia,
          },
          {
            value: false,
            label: labelURL,
          },
        ]}
      />
      {(media?.video || media?.pdf) && (
        <label className='btn btn-dark btn-block text-center'>
          {textBtn}
          <Input onChange={handleOnChange} type='file' accept={media?.video ? 'video/*' : 'application/pdf'} hidden />
          {!uploading && (values?.video?.Location || values?.pdf?.Location) && (
            <Button style={{ backgroundColor: 'transparent', border: 'none' }} title='remove'>
              <span onClick={handleRemove}>
                <CloseCircleFilled className='text-danger d-flex float-right' />
              </span>
            </Button>
          )}
        </label>
      )}
      {media?.url && (
        <Input
          placeholder={placeholderURL}
          onChange={handleURL}
          type='text'
          style={{ width: '100%', textAlign: 'center', marginTop: 1, padding: 3 }}
          value={values?.video?.Location || values?.pdf?.Location}
        />
      )}
      <MediaPlayer
        uploading={uploading}
        current={current}
        hostname={hostname}
        visible={visible}
        // values={values}
      />
    </>
  )
}

//  ;<>
//    <div style={{ margin: 0 }} className='beforeyoutube'>
//      {current?.video?.Location ? (
//        <>
//          {hostname === 'ems-dev.s3.ap-southeast-1.amazonaws.com' ? (
//            <label className='btn btn-dark btn-block text-left mt-3'>
//              {uploadVideoButtonText}
//              <input onChange={handleVideo} type='file' accept='video/*' hidden />
//            </label>
//          ) : (
//            <Input
//              placeholder='Vimeo, Youtube links'
//              onChange={handleURL}
//              type='text'
//              value={current?.video?.Location}
//              className='mt-2'
//            />
//          )}
//        </>
//      ) : (
//        <>
//          <div className='pt-5 mt-5'>
//            <Select
//              placeholder='Upload Video'
//              style={{
//                width: '100%',
//                marginTop: '10px',
//                textAlign: 'center',
//              }}
//              onChange={handleOption}
//              options={[
//                {
//                  value: true,
//                  label: 'video upload',
//                },
//                {
//                  value: false,
//                  label: 'url',
//                },
//              ]}
//            />
//            {video.video && (
//              <label className='btn btn-dark btn-block text-left mt-2'>
//                {uploadVideoButtonText}
//                <input onChange={handleVideo} type='file' accept='video/*' hidden />
//              </label>
//            )}
//            {video.url && (
//              <Input
//                placeholder='Vimeo, Youtube links'
//                onChange={handleURL}
//                type='text'
//                style={{ width: '100%', textAlign: 'center' }}
//                value={current?.video?.Location}
//                className='mt-2'
//              />
//            )}
//          </div>
//        </>
//      )}
//    </div>
//  </>
//

const MediaPlayer = ({ uploading, current, hostname, visible }) => {
  // console.log(values)
  console.log(visible.addLesson)
  return (
    <>
      {visible.addLesson
        ? ''
        : current?.video?.Location && (
            <div className='mt-5 pt-5'>
              {hostname === 'ems-dev.s3.ap-southeast-1.amazonaws.com' ? (
                <>
                  {current.video.Location}
                  {/* {windowSize.height > 1000 ? (
                <ReactPlayer url={current.video.Location} width='410px' height='240px' controls />
              ) : (
                <ReactPlayer url={current.video.Location} width='270px' height='150px' controls />
              )} */}
                </>
              ) : (
                <div>{current.video.Location}</div>
                // <ReactPlayer url={current.video.Location} controls onReady={changeSizeYouTube} />
              )}
            </div>
          )}
    </>
  )
}

export default SelectMedia
