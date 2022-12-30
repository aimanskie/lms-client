import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
const Quill = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})

const QuillEditor = ({ windowSize, content, setContent }) => {
  return (
    <Quill
      placeholder={'Write something awesome...'}
      // modules={modules}
      onChange={(e) => setContent(e)}
      theme='snow'
      style={
        windowSize.height > 1200
          ? { height: '50vh', marginBottom: '10px' }
          : windowSize.height > 855
          ? { height: '40vh', marginBottom: '10px' }
          : windowSize.height > 680
          ? { height: '30vh', marginBottom: '10px' }
          : { height: '10vh', marginBottom: '10px' }
      }
      value={content}
    />
  )
}

export default QuillEditor

// const QuillNoSSRWrapper = dynamic(import('react-quill'), {
//   ssr: false,
//   loading: () => <p>Loading ...</p>,
// })


// const modules = {
//   toolbar: [
//     [{ header: '1' }, { header: '2' }, { header: '3' }, { font: [] }],
//     [{ size: [] }],
//     ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//     [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
//     ['link', 'image'],
//     ['clean'],
//   ],
//   clipboard: {
//     matchVisual: false,
//   },
// }

  // <QuillEditor windowSize={windowSize} content={content} setContent={setContent} />

      //  <QuillNoSSRWrapper
      //     modules={modules}
      //     onChange={handleContent}
      //     theme='snow'
      //     style={
      //       windowSize.height > 1200
      //         ? { height: '50vh', marginBottom: '10px' }
      //         : windowSize.height > 855
      //         ? { height: '40vh', marginBottom: '10px' }
      //         : windowSize.height > 680
      //         ? { height: '30vh', marginBottom: '10px' }
      //         : { height: '10vh', marginBottom: '10px' }
      //     }
      //     value={current.content}
      //   />