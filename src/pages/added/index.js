import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'

import './index.scss'

function Added() {

  const continueBtnClicked = () => {
    console.log('continualBtnClicked')
    Taro.redirectTo({
      url: '/pages/add/index'
    })
  }

  return (
    <View>

      {/* 输入的提示信息 */}
      <View>
        <View className='success-info'>
          <View className='at-row at-row__justify--center'>
            <View className='madpill icon-success' />
          </View>
          <View className='at-row at-row__justify--center'>
            您已成功添加该药品！
          </View>
        </View>
      </View>

      {/* 当前药品 TODO */}
      <View className='success-medicine'>
      </View>

      {/* 继续添加 */}
      <View>
        <View className='continue-input at-row at-row__justify--center'>
          <View className='at-col-8'>
            <AtButton className='continue-btn' onClick={continueBtnClicked}>继续添加</AtButton>
          </View>
        </View>
      </View>

    </View>
  )
}

Added.config = {
  navigationBarTitleText: '添加成功',
}

export default Added
