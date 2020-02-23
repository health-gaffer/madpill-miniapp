import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'

function MPForm(props) {

  return (
    <View>
      {props.children}
    </View>
  )
}

MPForm.defaultProps = {
}

export default MPForm
