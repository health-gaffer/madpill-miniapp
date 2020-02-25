import {Textarea} from '@tarojs/components'

import './index.scss'

function MPTextArea(props) {

  // 项索引ID、提示信息、
  const {mpid, value, placeholder} = props

  const handleChange = (e) => {
    // console.log(curItemLabel)
    // console.log(e)
    props.onItemChange(JSON.stringify({
      content: e.target.value
    }), mpid)
    return e.target.value
  }

  return (
    <Textarea
      value={JSON.parse(value).content}
      placeholder={placeholder}
      placeholderClass='non-input'
      autoHeight
      cursorSpacing={20}
      maxlength={800}
      onBlur={handleChange}
    />
  )
}

MPTextArea.defaultProps = {
  mpid: '',
  value: JSON.stringify({
    content: ''
  }),
  placeholder: '',
}

export default MPTextArea
