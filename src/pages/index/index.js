import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './index.scss'
import MedicineItem from '../../components/MedicineItem'
import MedicineTag from '../../components/MedicineTag'

export default class Index extends Component {

  config = {
    navigationBarTitleText: 'Mad Pill',
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark'
  }

  constructor() {
    super()
    this.state = {
    }
  }

  onPullDownRefresh() {
    this.init()
  }

  init = () => {
    console.log('init')
  }

  render () {
    return (
      <View className='index'>
        <Text>Hello world!</Text>
        <MedicineItem />
        <MedicineTag />
      </View>
    )
  }
}
