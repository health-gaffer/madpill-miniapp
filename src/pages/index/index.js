import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'

import './index.scss'
import {get} from "../../global"

export default class Index extends Component {
  //TODO 删除药品后回到主页面如何比较好地进行提示
  constructor() {
    super()
    this.state = {
      tags:[{id:1,name:'头疼'},{id:2,name:'咳嗽'}],
      data:1
    }
  }

  componentDidShow() {
    console.log(get("tags"))
  }

  config = {
    enablePullDownRefresh: true,
  }

  onPullDownRefresh() {
    this.init()
  }
  routeToTag = () => {
    Taro.navigateTo({
      url: '/pages/tagManage/index?tags='+ JSON.stringify(this.state.tags)
    })
  }

  routeToAdd = () => {
    Taro.navigateTo({
      url: '/pages/add/index'
    })
  }

  routeToDetail = () => {
    Taro.navigateTo({
      url: '/pages/medicine/index?action=review&medicineId=100000002'
    })
  }

  render () {
    return (
      <View className='index'>
        <Button type='primary' onClick={this.routeToAdd}>添加药品</Button>
        <Button type='plain' onClick={this.routeToDetail}>查看详情</Button>
        <Button type='primary' onClick={this.routeToTag}>管理药品</Button>
        <Button type='primary' onClick={this.routeToTag}>标签管理</Button>
      </View>
    )
  }
}
