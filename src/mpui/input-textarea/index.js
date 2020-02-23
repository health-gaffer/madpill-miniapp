import Taro, {useEffect, useState} from '@tarojs/taro'
import { Textarea } from '@tarojs/components'

import './index.scss'

function MPTextArea(props) {

  // 项索引ID、提示信息、
  const {mpid, placeholder} = props

  // 因为通过 props.onItemChange 父组件只更新了部分属性而不是整个对象，所以比较时父组件的传递 data 与子组件中的 props 是一个对象，故需要自己维护状态
  // props.value 是 JSON 串，content 是内容 String
  const [content, setContent] = useState(props.value)

  useEffect(() => {
    setContent(JSON.parse(props.value).content)
  }, [props.value])

  const handleChange = (e) => {
    // console.log(curItemLabel)
    // console.log(e)
    setContent(e.detail.value)
    props.onItemChange(JSON.stringify({
      content: e.target.value
    }), mpid)
    return e.target.value
  }

  return (
    <Textarea
      value={content}
      placeholder={placeholder}
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
