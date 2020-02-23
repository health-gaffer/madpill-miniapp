import Taro, {useDidShow, useEffect, useState} from '@tarojs/taro'
import {Input, Text, View} from '@tarojs/components'
import {AtButton, AtIcon} from 'taro-ui'

import './index.scss'
import {get} from '../../global'

function MPInputNavigation(props) {

  // 项索引ID、提示信息、
  const {mpid, urlToNavigate, iconValue} = props

  // 因为通过 props.onItemChange 父组件只更新了部分属性而不是整个对象，所以比较时父组件的传递 data 与子组件中的 props 是一个对象，故需要自己维护状态
  const [value, setValue] = useState(props.value)

  // 父组件中数据加载变动
  useEffect(() => {
    // console.log(`${mpid}'s props value changed`)
    setValue(props.value)
  }, [props.value])

  useDidShow(() => {
    const curValue = get(mpid)
    if (curValue) {
      setValue(curValue)
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
          placeholder={props.represent()}
          placeholderClass='non-input'
        />
      </View>
      <View className='at-col-2'>
        <View className='at-row at-row__justify--end'>
          {
            value.length > 12 &&
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
