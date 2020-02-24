import Taro, {Component} from '@tarojs/taro';
import {Button, Input, Text, View} from '@tarojs/components';
import {AtAvatar,AtToast} from 'taro-ui';

import './index.scss';
import addIcon from '../../assets/icons/add.png';
import MedicineList from '../../components/MedicineList';
import {get, set} from "../../global";
import GroupMenu from '../../components/GroupMenu'
import {getToken} from '../../utils/login'

export default class HomePage extends Component {

  config = {
    navigationBarTitleText: 'Mad Pill',
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark'
  };

  constructor() {
    super();
    this.state = {
      loggedIn: false,
      userInfo:'',
      keyword: '',
      showToast: false,
      titleToast:'',
      loadingGroup:false,
      curGroup:{},
      groupList:[]
    };
  }

  // 搜索框内容改变
  handleSearch(e) {
    this.setState({
      keyword: e.detail.value
    })
  };

  componentDidMount() {
    this.checkLoginStatus();
    //todo initList
    getToken({
      success: (token) =>{
        let requestHeader = {}
        requestHeader['madpill-token'] = token
        console.log(HOST + '/groups  ' + token)
        Taro.request({
          url: HOST+ `/users/groups`,
          method: 'GET',
          header: requestHeader,
          success: result => {
            console.log(result.data.data)
            this.setState({
              groupList: result.data.data,
              loadingGroup: true
            })
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

    //todo 需要细节化
    this.setState({
      curGroup:{id : 1, name: "我的药箱",alias: "我的药箱",createBy:1},
    })
  }

  componentDidShow() {

    const option = get('option')
    if (option != null){
      console.log(123);
      if(option['code'] === 'delete'){
        this.setState({
          titleToast : option['msg'],
          showToast : true
        })
      }
      set('option',null)
      this.child.updateList()
    }
  }

  onPullDownRefresh() {
    this.child.updateList()
    this.checkLoginStatus();
    Taro.stopPullDownRefresh();
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
                this.setState({
                  userInfo: res.userInfo
                });
              },
              fail: err => {
                console.error(err);
                this.setState({
                  loggedIn: false
                });
              }
            });
          });
        }
      }
    });
  };
  changeGroup = (value) => {
    //todo change the viewList
    console.log(value)
  }
  handleAddDrug = () => {
    // console.log('I will add a new drug.');
    Taro.navigateTo({
      url: '/pages/add/index'
    })
  };
  onRef = (ref) => {
    this.child = ref
  }

  handleNewGroup = (value) => {
    console.log(value)
    const groupList =  this.state.groupList
    groupList.push(value)
    this.setState({
      curGroup : value,
      groupList : groupList
    })
  }

  handleGetUserInfo = (e) => {
    if (e.detail.rawData) {
      const userInfo = JSON.parse(e.detail.rawData);
      console.log(userInfo);
      this.setState({
        loggedIn: true,
        userInfo: userInfo
      });
    }
  };

  render() {
    return (
      <View>
        <AtToast isOpened={this.state.showToast} duration={1000} text= {this.state.titleToast} status={"success"} />
        <View className='login'>
          <View className='top-area'>
            <View className='top-left-area'>
              <AtAvatar className='avatar' circle size='small'
                image={this.state.loggedIn ? (this.state.userInfo ? this.state.userInfo.avatarUrl : 'https://jdc.jd.com/img/200') : 'https://jdc.jd.com/img/200'}
              />
              <View className='group'>
                <GroupMenu loading={this.state.loadingGroup} curGroup={this.state.curGroup} onCreateGroup={this.handleNewGroup} groupList={this.state.groupList} onChangeGroup={this.changeGroup}/>
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
          <View className='search-area'>
            <Input
              className='search-input'
              value={this.state.keyword}
              placeholder='搜索'
              onInput={this.handleSearch.bind(this)}
            />
          </View>
        </View>
        {this.state.loggedIn && <MedicineList onRef={this.onRef} groupId={this.state.curGroup.id} keyword={this.state.keyword} />}
      </View>
    );
  }
}
