import Taro, {useDidShow} from '@tarojs/taro'
import {Input, Text, View} from '@tarojs/components'
import {AtButton, AtIcon} from 'taro-ui'

import './index.scss'
import {get} from '../../global'

function MPInputNavigation(props) {

  // 项索引ID、提示信息、
  const {mpid, urlToNavigate, iconValue} = props

  const representStr = props.represent()

  useDidShow(() => {
    const curValue = get(mpid)
    if (curValue) {
      props.onItemChange(curValue, mpid)
    }
  })

  const iconBtnClicked = () => {
    Taro.navigateTo({
      url: `${urlToNavigate()}`
    })
  }

  return (
    <View className='at-row'>
      <View className='at-col-10'>
        <Input
          disabled
          type='text'
          placeholder={representStr}
          placeholderClass='non-input'
        />
      </View>
      <View className='at-col-2'>
        <View className='at-row at-row__justify--end'>
          {
            representStr.length > 12 &&
            <Text className='non-input'>
              ...
            </Text>
          }
          {
            iconValue &&
            <AtButton className='icon-btn' onClick={iconBtnClicked}>
              <AtIcon value={iconValue} size='16' />
            </AtButton>
          }
        </View>
      </View>
    </View>
  )
}

MPInputNavigation.defaultProps = {
  mpid: '',
  iconValue: '',
  urlToNavigate: () => '',
  represent: () => '',
}

export default MPInputNavigation
