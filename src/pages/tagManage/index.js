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
    const tags = JSON.parse(this.$router.params.tags)
    const allTags =  [{id:1,name:'感冒'},{id:2,name:'发烧'},{id:3,name:'治脚气'}];
    this.setState({
      name : '双黄连口服液',
      tags : tags,
      allTags : allTags,
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
    const index = this.indexOfTag(tags,value.name);
    if(index >= 0){
      tags.splice(index,1);
    }else{
      tags.push(value)
    }
    this.setState({
      tags:tags
    })
  }

  indexOfTag(tags,name){
    var index = -1;
    var i = 0;
    tags.map(tag => {
      if (tag.name == name){
        index = i;
      }
      i++;
    });
    return index;
  }

  addNewTag (value) {
    const { tags,allTags } = this.state
    //todo 传userID 和 value.name 生成tag返回
    value.id = 10;
    if(this.indexOfTag(allTags,value.name) < 0){
      allTags.push(value);
    }
    if(this.indexOfTag(tags,value.name) < 0){
      tags.push(value)
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
    console.log(value.name)
    Taro.showModal({
      title: '删除标签',
      content: '确认删除标签' + value.name,
    })
      .then(res => {
        if (res.confirm){
          this.confirmRemoveTag(value)
        }
      })

  }
  confirmRemoveTag(tag){
    const { tags,allTags } = this.state
    //todo 把tag删除掉

    if(this.indexOfTag(allTags,tag.name) >= 0){
      allTags.splice(this.indexOfTag(allTags,tag.name),1);
    }
    if(this.indexOfTag(tags,tag.name) >= 0){
      tags.splice(this.indexOfTag(tags,tag.name),1)
    }
    this.setState({
      confirmDelete: '',
      tags:tags,
      allTags: allTags
    })
  }
  // componentWillUnmount() {
  //   var pages = getCurrentPages()
  //   var prevPage = pagesr[pages.length - 1]; // 上一个页
  //   console.log(prevPage.state)
  //   prevPage.setData({
  //     data: 2
  //   });
  //
  // }
  render () {
    const { tags,allTags,isManage,disabled} = this.state
    return (

      <View className='panel'>
        <View className='cur-tags'>
            {tags.map((tag) =>
              <TagItem key={tag.id} name={tag.name}  id={tag.id}  disabled={disabled} isManage={false} onClick={this.handleClick.bind(this)} active={true}/>
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
              return <TagItem key={tag.id}  onLongPress={this.manageTag.bind(this)} disabled={false} isManage={isManage} name={tag.name} id={tag.id} onRemoveTag={this.removeTag.bind(this)} onClick={this.handleClick.bind(this)} active={this.indexOfTag(tags,tag.name) >= 0}/>
            })}
          </View>
        </View>
      </View>
    )
  }
}
