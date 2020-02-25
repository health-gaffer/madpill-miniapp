import {Text, View} from '@tarojs/components'
import {AtActivityIndicator, AtButton} from 'taro-ui'

import './index.scss'

function MPButton(props) {

  const {loading, label, type = 'primary'} = props

  const indicatorColor = () => {
    switch (type) {
      case 'primary':
        return 'white'
      case 'danger':
        return 'red'
      default:
        return 'white'
    }
  }

  return (
    <AtButton className={type} onClick={props.onClick}>
      {
        loading === true
          ?
          <View className='at-row at-row__justify--center at-row__align--center'>
            <AtActivityIndicator className='at-col-2' color={indicatorColor()} />
            <Text className='at-col--auto'>正在{label}</Text>
          </View>
          :
          <Text>确认{label}</Text>
      }
    </AtButton>
  )
}

MPButton.defaultProps = {
  loading: false,
  label: '',
  type: 'primary',
}

export default MPButton
