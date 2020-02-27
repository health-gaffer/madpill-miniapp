import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTag, AtButton } from 'taro-ui'

import './index.scss'

export default class TagItem extends Component {

  constructor(props) {
    super(props)
  }

  handleClick (e) {
    this.props.onClick(this.props.tag)
  }
  removeTag(){
    this.props.onRemoveTag(this.props.tag)
  }
  longPress(){
    if(this.props.onLongPress && !this.props.isManage){
      this.props.onLongPress()
    }
  }

  render() {
    const { active } = this.props
    return (
      <View className='tag-group' onLongPress={this.longPress.bind(this)}>
        {this.props.isManage?<AtButton className='badge'  onClick={this.removeTag.bind(this)} size='small' circle> X </AtButton>:<View />}
        <AtTag
          className='my-tag'
          type='primary'
          circle
          disabled={this.props.disabled}
          active={active}
          onClick={this.handleClick.bind(this)}
        >
          {this.props.tag.name}</AtTag>
      </View>
    )
  }
}
