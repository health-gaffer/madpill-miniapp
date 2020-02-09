import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'

import './index.scss'


export default class Index extends Component {

  constructor() {
    super()
    this.state = {
    }
  }

  config = {
    enablePullDownRefresh: true,
  }

  onPullDownRefresh() {
    this.init()
  }

  init = () => {
    console.log('init')
  }

  routeToAdd = () => {
    Taro.navigateTo({
      url: '/pages/add/index'
    })
  }

  render () {
    return (
      <View className='index'>
        <Button type='primary' onClick={this.routeToAdd}>添加药品</Button>
      </View>
    )
  }
}
