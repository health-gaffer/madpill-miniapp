import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'

import './index.scss'
import addIcon from '../../assets/icons/add.png'

export default class Login extends Component {

  config = {
    navigationBarTitleText: 'Mad Pill',
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark'
  }

  constructor() {
    super()
    this.state = {
      loggedIn: false
    }
  }

  componentDidMount() {
    this.checkLoginStatus()
  }

  onPullDownRefresh() {
    this.checkLoginStatus()
    Taro.stopPullDownRefresh()
  }

  checkLoginStatus = () => {
    Taro.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.setState({
            loggedIn: true
          }, () => {
            Taro.getUserInfo({
              success: res => {
                console.log(res)
                this.setState({
                  userInfo: res.userInfo
                })
              },
              fail: err => {
                console.error(err)
                this.setState({
                  loggedIn: false
                })
              }
            })
          })
        }
      }
    })
  }

  handleAddDrug = () => {
    console.log("I will add a new drug.")
  }

  handleGetUserInfo = (e) => {
    if (e.detail.rawData) {
      const userInfo = JSON.parse(e.detail.rawData)
      console.log(userInfo)
      this.setState({
        loggedIn: true,
        userInfo: userInfo
      })
    }
  }

  render () {
    return (
      <View className="login">
        <View className="top-area">
          <View className="top-left-area">
            <AtAvatar className="avatar" circle size="small" image={this.state.loggedIn ? (this.state.userInfo ? this.state.userInfo.avatarUrl : "https://jdc.jd.com/img/200") : "https://jdc.jd.com/img/200"} />
            <Text className="title">我的药箱</Text>
          </View>
          <View className="top-right-area">
            <Image
                className='add-drug-icon'
                src={addIcon}
                mode='aspectFit'
                onClick={this.handleAddDrug}
              />
          </View>
        </View>
        { !this.state.loggedIn ?
          <View className="login-area">
            体验更完整的功能，请先完成
            <Button
              className="login-button"
              size="mini"
              openType="getUserInfo"
              onGetUserInfo={this.handleGetUserInfo}
            >登录</Button>
          </View>
        :
          null
        }

        <View className="search-area">

        </View>
        <View className="drug-list-area">

        </View>
      </View>
    )
  }
}
