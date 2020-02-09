import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from "taro-ui"

import './index.scss'
import Medicine from "../../components/Medicine"

function Add(props) {

  const {act = 'review'} = props

  return (
    <View>
      <Medicine>
        <View className='act'>
          {
            act === 'new' &&
            <View className='at-row at-row__justify--center'>
              <View className='at-col-8'>
                <AtButton className='add'>确认添加</AtButton>
              </View>
            </View>
          }

          {
            act === 'review' &&
            <View className='at-row at-row__justify--center'>
              <View className='at-col-8'>
                <AtButton className='add at-col-12'>确认修改</AtButton>
                <AtButton className='delete'>删除药品</AtButton>
              </View>
            </View>
          }
        </View>
      </Medicine>

    </View>
  )
}

Add.config = {
  navigationBarTitleText: '添加药品',
}

export default Add
