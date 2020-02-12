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
  routeToTag = () => {
    Taro.navigateTo({
      url: '/pages/tagManage/index'
    })
  }

  render () {
    return (
      <View className='index'>
        <Button type='primary' onClick={this.routeToTag}>管理药品</Button>
      </View>
    )
  }
}
