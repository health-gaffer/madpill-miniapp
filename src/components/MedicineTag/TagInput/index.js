import Taro, { Component } from '@tarojs/taro'
import { AtInput } from 'taro-ui'
import '../index.scss'

export default class TagInput extends Component {
  constructor(props) {
    super(props)
    this.setState({
      newTagName: '',
    })
  }
  addTag(){
    const newTag = this.state.newTagName.trim()
    if(newTag === ''){
      return
    }
    console.log(newTag)
    this.props.onAddNewTag({
      name: newTag
    })
    this.setState({
      newTagName: ''
    },()=>{
      this.handleChange('')
    })
  }

  handleChange (value) {
      this.setState({
        newTagName: value.trim()
      })
      return value
  }

  render() {
    return (
      <AtInput
        name='value'
        type='text'
        className='tag-input'
        border={false}
        placeholder='添加标签'
        value={this.state.newTagName}
        maxLength={10}
        disabled={this.props.disabled}
        confirmType='添加'
        onChange={this.handleChange.bind(this)}
        onConfirm={this.addTag.bind(this)}
      />
    )
  }
}
