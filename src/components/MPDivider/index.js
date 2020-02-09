import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtDivider }  from 'taro-ui'

function MPDivider(props) {

  const {height='40', padding='0px', color='#e6e6e6'} = props;
  return (
    <View style={{paddingLeft: padding, paddingRight: padding}}>
      <View className='at-row'>
        <AtDivider height={height} lineColor={color} />
      </View>
    </View>
  )
}

export default MPDivider
