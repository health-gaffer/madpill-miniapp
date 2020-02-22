import Taro, {Component} from '@tarojs/taro'
import {View, Input} from '@tarojs/components'
import {AtIcon, AtInput, AtModal, AtModalHeader, AtModalContent, AtModalAction} from "taro-ui"
import './index.scss'
import TagItem from "../MedicineTag";

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
      newGroupName: ''
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
    console.log(this.state.newGroupName)
  }
  render() {
    const {groupList} = this.props
    const createIcon = <AtIcon value='home' size='20'/>
    const addIcon = <AtIcon value='add' size='20'/>
    return (
      <View className='menu'>

        <View className='current' onClick={this.togglePanel}>
          <View className='cur-group'>{this.props.curGroup['alias']}</View>
          <View>
            <AtIcon value='chevron-down' size='24'></AtIcon>
          </View>
        </View>
        {this.props.showPanel ?
          <View className='panel'>
            <View className='switch-group'>
              {groupList.map((group) =>
                <View key={group.id} className='group-item' onClick={this.handleClick.bind(this, group['id'])}>
                  {group['alias']}
                </View>
              )}
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

      </View>
    )
  }
}
