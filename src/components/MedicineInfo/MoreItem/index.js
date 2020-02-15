import Taro, {useEffect, useState} from '@tarojs/taro'
import { View, Textarea } from '@tarojs/components'

import './index.scss'

function MoreItem(props) {

  const {itemLabel, itemName} = props.item
  const [content, setContent] = useState(props.value)

  useEffect(() => {
    setContent(props.value)
  }, [props.value])

  const handleChange = (curItemLabel) => (e) => {
    // console.log(curItemLabel)
    // console.log(e)
    setContent(e.detail.value)
    props.onClicked(e.target.value, curItemLabel)
    return e.target.value
  }

  return (
    <View className='extra-item'>
      <View className='head at-row at-row__justify--center'>
        <View className='at-col--auto'>
          {itemName}
        </View>
      </View>
      <View className='content at-row at-row__justify--center'>
        <Textarea
          value={content}
          placeholder={`请输入${itemName}`}
          autoHeight
          cursorSpacing={20}
          maxlength={800}
          onBlur={handleChange(itemLabel)}
        />
      </View>

    </View>
  )
}

MoreItem.defaultProps = {
  item: {},
  value: '',
}

export default MoreItem
