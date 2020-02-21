import Taro, {Component} from '@tarojs/taro';
import {Button, Input, Text, View} from '@tarojs/components';
import {AtAvatar,AtToast,AtIcon} from 'taro-ui';

import './index.scss';
import addIcon from '../../assets/icons/add.png';
import {getToken} from '../../utils/login';
import MedicineList from '../../components/MedicineList';
import {get, set} from "../../global";
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
      titleToast:''
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

  handleAddDrug = () => {
    // console.log('I will add a new drug.');
    Taro.navigateTo({
      url: '/pages/add/index'
    })
  };
  onRef = (ref) => {
    this.child = ref
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
        <AtToast isOpened={this.state.showToast} duration={1000} text= {this.state.titleToast} status={"success"} ></AtToast>
        <View className='login'>
          <View className='top-area'>
            <View className='top-left-area'>
              <AtAvatar className='avatar' circle size='small'
                image={this.state.loggedIn ? (this.state.userInfo ? this.state.userInfo.avatarUrl : 'https://jdc.jd.com/img/200') : 'https://jdc.jd.com/img/200'}
              />
              <Text className='title'>我的药箱</Text>
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
        {this.state.loggedIn && <MedicineList onRef={this.onRef} keyword={this.state.keyword} />}
      </View>
    );
  }
}
