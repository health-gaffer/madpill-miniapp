import Taro, {Component} from '@tarojs/taro'
import {Button, View} from '@tarojs/components'
import {AtAvatar, AtToast} from 'taro-ui'

import './index.scss'
import addIcon from '../../assets/icons/add.png'
import MedicineList from '../../components/MedicineList'
import {get, set} from '../../global'
import GroupMenu from '../../components/GroupMenu'
import {getToken} from '../../utils/login'
import MPForm from '../../mpui/form'
import MPFormItem from '../../mpui/form-item'
import MPSearchBar from '../../mpui/search-bar'

export default class HomePage extends Component {

  config = {
    navigationBarTitleText: 'Mad Pill',
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark'
  }

  constructor() {
    super()
    this.state = {
      loggedIn: false,
      userInfo: '',
      keyword: '',
      showToast: false,
      titleToast: '',
      loadingGroup: true,
      curGroup: {},
      groupList: []
    }
  }

  // 搜索框内容改变
  handleSearch(newKeyword) {
    this.setState({
      keyword: newKeyword
    })
  };

  componentDidMount() {
    this.checkLoginStatus()
  }

  getGroupInfo() {
    getToken({
      success: (token) => {
        let requestHeader = {}
        requestHeader['madpill-token'] = token
        console.log(HOST + '/groups  ' + token)
        Taro.request({
          url: HOST + '/groups',
          method: 'GET',
          header: requestHeader,
          success: result => {
            console.log(result.data.data)
            this.setState({
              groupList: result.data.data,
              curGroup: result.data.data[0],
              loadingGroup: false
            })
            this.child.updateList(result.data.data[0].id)
          },
          fail: error => {
            console.log('fail')
            console.log(error)
          }
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  }

  componentDidShow() {
    const option = get('option')
    if (option != null) {
      if (option['code'] === 'delete' || option['code'] === 'update') {
        this.setState({
          titleToast: option['msg'],
          showToast: true
        })
      }
      set('option', null)
      this.child.updateList(this.state.curGroup.id)
    }
  }

  onPullDownRefresh() {
    if (this.state.loggedIn) {
      this.child.updateList(this.state.curGroup.id)
    } else {
      this.checkLoginStatus()
    }
    Taro.stopPullDownRefresh()
  }

  checkLoginStatus = () => {
    Taro.getSetting({
      success: res1 => {
        if (res1.authSetting['scope.userInfo']) {
          this.setState({
            loggedIn: true
          }, () => {
            Taro.getUserInfo({
              success: res2 => {
                this.setState({
                  userInfo: res2.userInfo
                })
                this.getGroupInfo()
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
  changeGroup = (value) => {
    //todo change the viewList
    console.log(value)
    console.log(this.state.groupList)
    this.state.groupList.map(group => {
      if (group.id === value) {
        this.setState({
          curGroup: group
        })
      }
    })
    this.child.updateList(value)
  }

  handleAddDrug = () => {
    // console.log('I will add a new drug.');
    Taro.navigateTo({
      url: '/pages/add/index'
    })
  }

  onRef = (ref) => {
    this.child = ref
  }

  handleNewGroup = (value) => {
    console.log(value)
    const groupList = this.state.groupList
    groupList.push(value)
    this.setState({
      curGroup: value,
      groupList: groupList
    })
    this.child.updateList(value.id)
  }

  handleGetUserInfo = (e) => {
    if (e.detail.rawData) {
      const userInfo = JSON.parse(e.detail.rawData)
      console.log(userInfo)
      this.setState({
        loggedIn: true,
        userInfo: userInfo
      })
      this.getGroupInfo()
    }
  }

  render() {
    return (
      <View>
        <AtToast isOpened={this.state.showToast} duration={1000} text={this.state.titleToast} status='success' />
        <View className='login'>
          <View className='top-area'>
            <View className='top-left-area'>
              <AtAvatar className='avatar' circle size='small'
                image={this.state.loggedIn ? (this.state.userInfo ? this.state.userInfo.avatarUrl : 'https://jdc.jd.com/img/200') : 'https://jdc.jd.com/img/200'}
              />
              <View className='group'>
                <GroupMenu loading={this.state.loadingGroup} curGroup={this.state.curGroup}
                  onCreateGroup={this.handleNewGroup} groupList={this.state.groupList}
                  onChangeGroup={this.changeGroup}
                />
              </View>
            </View>
            <View className='top-right-area' onClick={this.handleAddDrug}>
              <Image
                className='add-drug-icon'
                src={addIcon}
                mode='aspectFit'
              />
            </View>
          </View>
          {!this.state.loggedIn ?
            <View className='login-area'>
              体验更完整的功能，请先
              <Button
                className='login-button'
                size='mini'
                openType='getUserInfo'
                onGetUserInfo={this.handleGetUserInfo}
              >登录</Button>
            </View>
            :
            null
          }

          {/* 搜索框 */}
          <MPForm>
            <MPFormItem>
              <MPSearchBar
                keyword={this.state.keyword}
                placeholder='搜索'
                onChange={this.handleSearch.bind(this)}
              />
            </MPFormItem>
          </MPForm>
        </View>
        {this.state.loggedIn && <MedicineList onRef={this.onRef} keyword={this.state.keyword} />}
      </View>
    )
  }
}
