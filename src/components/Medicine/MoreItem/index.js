import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'

function MoreItem(props) {

  const {infoName} = props
  return (
    <View className='extra-item'>
      <View className='head'>

      </View>
      <View className='content'>
        {props.children}
      </View>

    </View>
  )
}

export default MoreItem
