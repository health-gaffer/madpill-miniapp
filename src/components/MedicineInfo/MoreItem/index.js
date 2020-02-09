import Taro, { useState } from '@tarojs/taro'
import { View, Textarea } from '@tarojs/components'

import './index.scss'

function MoreItem(props) {

  const {itemName} = props.item
  const [content, setContent] = useState('')

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
        />
      </View>

    </View>
  )
}

MoreItem.defaultProps = {
  item: {}
}

export default MoreItem
