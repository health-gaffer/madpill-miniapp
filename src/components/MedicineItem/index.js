import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

export default class AssignmentItem extends Component {

  constructor() {
    super()
  }

  handleClick = () => {
    console.log('item clicked!')
  }

  render() {
    return (
      <View className='medicine-item'>
        <Text className='title'>Hello</Text>
        <Text className='desc'>I am a medicine item.</Text>
      </View>
    )
  }

}
