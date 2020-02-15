import Taro, { Component } from '@tarojs/taro'
import {View, Text, Button} from '@tarojs/components'
import {AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"

import './index.scss'
import TagItem from '../../components/MedicineTag'
import TagInput from '../../components/MedicineTag/TagInput'


export default class TagPage extends Component {
  config = {
    navigationBarTitleText: 'Pill',
    backgroundTextStyle: 'dark',
    enablePullDownRefresh: false,
    backgroundColor:'#f5f4f4'

}

  constructor() {
    super()
    this.state = {
      name:''
    }
  }

  componentWillMount() {
    // const { id, name } = this.$router.params;
    const name = "双黄连口服液"
    this.setState({
      name : '双黄连口服液',
      tags : ['感冒','发烧','鼻炎'],
      allTags : ['感冒','发烧','鼻炎','治脚气','头疼'],
      isManage : false,
      confirmDelete : '',
      disabled : false
    });
    Taro.setNavigationBarTitle({
      title: name
    });
  }


  handleClick (value) {
    if(this.state.isManage){
      this.removeTag(value)
      return
    }

    const { tags } = this.state
    const index = tags.indexOf(value.tag);
    if(index >= 0){
      tags.splice(index,1);
    }else{
      tags.push(value.tag)
    }
    this.setState({
      tags:tags
    })
  }
  addNewTag (value) {
    const { tags,allTags } = this.state

    if(allTags.indexOf(value.tag) < 0){
      allTags.push(value.tag);
    }
    if(tags.indexOf(value.tag) < 0){
      tags.push(value.tag)
    }
    this.setState({
      tags:tags,
      allTags: allTags
    })
  }

  manageTag(){
    const {isManage,disabled} = this.state
    this.setState({
      isManage:!isManage,
      disabled:!disabled
    })
  }
  removeTag(value){
    console.log(value.tag)
    Taro.showModal({
      title: '删除标签',
      content: '确认删除标签' + value.tag,
    })
      .then(res => {
        if (res.confirm){
          this.confirmRemoveTag(value.tag)
        }
      })

  }
  confirmRemoveTag(confirmDelete){
    const { tags,allTags } = this.state
    if(allTags.indexOf(confirmDelete) >= 0){
      allTags.splice(allTags.indexOf(confirmDelete),1);
    }
    if(tags.indexOf(confirmDelete) >= 0){
      tags.splice(tags.indexOf(confirmDelete),1)
    }
    this.setState({
      confirmDelete: '',
      tags:tags,
      allTags: allTags
    })
  }

  render () {
    const { tags,allTags,isManage,disabled} = this.state
    return (

      <View className='panel'>
        <View className='cur-tags'>
            {tags.map((tag) =>
              <TagItem key={tag} name={tag}  disabled={disabled} isManage={false} onClick={this.handleClick.bind(this)} active={true}/>
            )}
            <TagInput disabled={disabled} onAddNewTag={this.addNewTag.bind(this)}/>
        </View>
        <View className='title'>
          <Text>
            所有标签
          </Text>
          {!isManage ? <Text/> :
            <AtButton onClick={this.manageTag.bind(this)} type='secondary' size='small'>
              取消
            </AtButton>
          }
        </View>
        <View className='all-tags'>
          <View className='all-tag-manage'>
            {allTags.map((tag) => {
              return <TagItem key={tag}  onLongPress={this.manageTag.bind(this)} disabled={false} isManage={isManage} name={tag} onRemoveTag={this.removeTag.bind(this)} onClick={this.handleClick.bind(this)} active={tags.indexOf(tag) >= 0}/>
            })}
          </View>
        </View>
      </View>
    )
  }
}
