import Taro, {useDidShow, useEffect, useState} from '@tarojs/taro'
import {Input, Text, View} from '@tarojs/components'
import {AtButton, AtIcon} from 'taro-ui'

import './index.scss'
import {get} from '../../global'

function MPInputNavigation(props) {

  // 项索引ID、提示信息、
  const {mpid, urlToNavigate, iconValue} = props

  useDidShow(() => {
    const curValue = get(mpid)
    if (curValue) {
      props.onItemChange(curValue, mpid)
    }
  })

  const iconBtnClicked = () => {
    Taro.navigateTo({
      url: `${urlToNavigate}`
    })
  }

  return (
    <View className='at-row'>
      <View className='at-col-10'>
        <Input
          disabled
          type='text'
          placeholder={props.represent}
          placeholderClass='non-input'
        />
      </View>
      <View className='at-col-2'>
        <View className='at-row at-row__justify--end'>
          {
            props.value.length > 12 &&
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
  value: '',
  urlToNavigate: '',
  iconValue: '',
  represent: () => {
    return ''
  },
}

export default MPInputNavigation
