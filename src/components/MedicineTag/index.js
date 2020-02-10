import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtTag } from 'taro-ui'
import './index.scss'

export default class TagItem extends Component {

  constructor(props) {
    super(props)
  }

  handleClick = () => {
    console.log('item clicked!')
  }

  render() {
    return (

      <AtTag
        className='my-tag'
        type='primary'
        circle
        active
        onClick={this.handleClick.bind(this)}>
        {this.props.name}</AtTag>
    )
  }
}
