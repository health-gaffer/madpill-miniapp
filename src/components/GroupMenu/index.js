import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon,AtButton } from 'taro-ui'

import './index.scss'
import TagItem from "../MedicineTag";
export default class GroupMenu extends Component {
  static defaultProps = {
    curGroup: {alias:'我的药箱',id:1},
  }
  constructor(props) {
    super(props)
    this.state = {
      showPanel: false
    }
    console.log(props)
  }

  handleClick (value,e){
    e.stopPropagation()
    this.props.onChangeGroup(value)
    this.togglePanel()
    // this.props.onClick(this.props.tag)
  }
  togglePanel = () => {
    const status = this.state.showPanel
    this.setState({
      showPanel: !status
    })
  }

  render() {
    const { groupList } = this.props
    const createIcon = <AtIcon value='home' size='20'/>
    const addIcon = <AtIcon value='add' size='20'/>
    return (
      <View  className='menu' onClick={this.togglePanel}>

        <View className='current'>
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
            <View className='options'>
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
          :<View/>
        }
        {this.props.showPanel ?
          <View className='blank-panel' onClick={this.togglePanel}/>
          : <View/>
        }
      </View>
    )
  }
}
