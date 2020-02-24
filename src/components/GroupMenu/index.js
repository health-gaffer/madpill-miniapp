import Taro, {Component} from '@tarojs/taro'
import {View, Input, Text} from '@tarojs/components'
import {
  AtIcon,
  AtInput,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtToast,
  AtModalAction,
  AtActivityIndicator
} from "taro-ui"
import './index.scss'
import {getToken} from "../../utils/login";
import {set} from "../../global";

export default class GroupMenu extends Component {
  static defaultProps = {
    curGroup: {alias: '我的药箱', id: 1},
  }



  constructor(props) {
    super(props)
    this.state = {
      showPanel: false,
      createGroupModal: false,
      addGroupModal: false,
      newGroupName: '',
      toast: {
        status: 'loading',
        showToast: false,
        message: ''
      }
    }
    console.log(props)
  }

  handleClick(value, e) {
    e.stopPropagation()
    this.props.onChangeGroup(value)
    this.togglePanel()
    // this.props.onClick(this.props.tag)
  }

  togglePanel = () => {
    const status = this.state.showPanel
    this.setState({
      showPanel: !status,
    })
  }
  showCreateModel = () => {
    this.setState({
      createGroupModal: true,
      showPanel: false,
    })
  }

  handleCreateChange =  (value) => {
    this.setState({
      newGroupName: value.trim()
    })
    return value
  }

  createGroup = () => {
    //todo 创建群组
    this.setState({
      toast: {
        status: 'loading',
        showToast: true,
        message: '正在创建...'
      }
    })
    getToken({
      success: (token) =>{
        let requestHeader = {}
        requestHeader['madpill-token'] = token
        Taro.request({
          url: HOST+ `/users/groups`,
          method: 'POST',
          header: requestHeader,
          data: this.state.newGroupName,
          success: result => {
            console.log(result.data.data)
            this.setState({
              toast: {
                status: 'success',
                showToast: true,
                message: '创建成功'
              },
              createGroupModal:false
            })

            this.props.onCreateGroup({
              id: result.data.data,
              name: this.state.newGroupName
            });
            this.interval = setInterval(() => {
              this.setState({
                toast: {
                  status: 'success',
                  showToast: false,
                  message: ''
                },
                newGroupName: ''
              })
              this.handleCreateChange('')
              clearInterval(this.interval);
            }, 1000);
          },
          fail: error => {
            console.log('fail')
            console.log(error)
            this.setState({
              toast: {
                status: 'fail',
                showToast: true,
                message: '创建失败，请重试'
              }
            })
            this.interval = setInterval(() => {
              this.setState({
                toast: {
                  status: '',
                  showToast: false,
                  message: ''
                },
              })
              clearInterval(this.interval);
            }, 1000);
          }
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  }
  render() {
    const {groupList} = this.props
    const createIcon = <AtIcon value='home' size='20'/>
    const addIcon = <AtIcon value='add' size='20'/>
    return (
      <View className='menu'>

        <View className='current' onClick={this.togglePanel}>
          <View className='cur-group'>{this.props.curGroup['name']}</View>
          <View>
            <AtIcon value='chevron-down' size='24'></AtIcon>
          </View>
        </View>
        {this.props.showPanel ?
          <View className='panel'>
            <View className='switch-group'>
              {this.props.loading ?
                <View className='loading'>
                  <AtActivityIndicator/>
                </View>
                :
                groupList.map((group) =>
                  <View key={group.id} className='group-item' onClick={this.handleClick.bind(this, group['id'])}>
                    {group['name']}
                  </View>
                )
              }
            </View>
            <View className='options' onClick={this.showCreateModel}>
              <View className='icon'>
                {createIcon}
              </View>
              <View className='title'>创建药箱</View>
            </View>
            <View className='options'>
              <View className='icon'>
                {addIcon}
              </View>
              <View className='title'>加入药箱</View>
            </View>
          </View>
          : <View/>
        }
        {this.props.showPanel ?
          <View className='blank-panel' onClick={this.togglePanel}/>
          : <View/>
        }
        <AtModal
          isOpened={this.state.createGroupModal}
          onClose={() => this.setState({createGroupModal: false})}
          onConfirm={this.createGroup}
          onCancel={() => this.setState({createGroupModal: false})}
        >
          <AtModalHeader>创建药箱</AtModalHeader>
          <AtModalContent>
            <AtInput clear type='text' placeholder='输入药箱名称' maxLength='10'
                     onChange={this.handleCreateChange} onConfirm={this.createGroup}/>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.createGroup}>确定</Button>
          </AtModalAction>
        </AtModal>
        <AtToast isOpened = {this.state.toast.showToast} duration = {0} text={this.state.toast.message} status={this.state.toast.status}/>
      </View>
    )
  }
}
