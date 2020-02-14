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
      tags:[{id:1,name:'感冒'},{id:2,name:'发烧'}],
      data:1
    }
  }

  onPullDownRefresh() {
    this.init()
  }
  routeToTag = () => {
    Taro.navigateTo({
      url: '/pages/tagManage/index?tags='+ JSON.stringify(this.state.tags)
    })
  }

  render () {
    return (
      <View className='index'>
        <Button type='primary' onClick={this.routeToTag}>{this.state.data}</Button>
      </View>
    )
  }
}
