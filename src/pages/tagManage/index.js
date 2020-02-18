import Taro, {Component} from '@tarojs/taro'
import {Text, View} from '@tarojs/components'
import {AtButton} from "taro-ui"

import './index.scss'
import TagItem from '../../components/MedicineTag'
import TagInput from '../../components/MedicineTag/TagInput'
import {getToken} from "../../utils/login"
import { HOST, MADPILL_RESPONSE_CODE} from "../../constants"

import {set} from '../../global'


export default class TagPage extends Component {
  config = {
    navigationBarTitleText: 'Pill',
    backgroundTextStyle: 'dark',
    enablePullDownRefresh: false,
    backgroundColor: '#f5f4f4'
  }

  constructor() {
    super()
    this.state = {
      name: '',
      tags: [],
      allTags: []
    }
  }

  componentWillMount() {
    getToken({
      success: (token) =>{
        let requestHeader = {}
        requestHeader['madpill-token'] = token
        console.log(HOST + '/tags' + token)
        Taro.request({
          url: HOST + `/tags`,
          method: 'GET',
          header: requestHeader,
          success: result => {
            this.setState({allTags: result.data.data})
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



    const name = "双黄连口服液"
    const tags = JSON.parse(this.$router.params.tags)
    // const allTags =  [{id:1,name:'感冒'},{id:2,name:'发烧'},{id:3,name:'治脚气'}];
    this.setState({
      name: '双黄连口服液',
      tags: tags,
      isManage: false,
      confirmDelete: '',
      disabled: false
    });
    Taro.setNavigationBarTitle({
      title: name
    });
  }


  handleClickTag(value) {
    if (this.state.isManage) {
      this.removeTag(value)
      return
    }

    const {tags} = this.state
    const index = this.indexOfTag(tags, value.name);
    if (index >= 0) {
      tags.splice(index, 1);
    } else {
      tags.push(value)
    }
    this.setState({
      tags: tags
    })
  }

  indexOfTag(tags, name) {
    var index = -1;
    var i = 0;
    tags.map(tag => {
      if (tag.name === name) {
        index = i;
      }
      i++;
    });
    return index;
  }

  addNewTag(value) {

    //todo get userId
    const {tags, allTags} = this.state
    const index1 = this.indexOfTag(allTags, value.name)
    const index2 = this.indexOfTag(tags, value.name)
    if (index1 >= 0) {
      if (index2 < 0) {
        tags.push(allTags[index1])
      }
    } else {
      getToken({
        success: (token) =>{
          let requestHeader = {}
          requestHeader['madpill-token'] = token
          console.log(token)
          Taro.request({
            url: HOST + '/tags',
            header: requestHeader,
            method: 'POST',
            data: value,
            success: result => {
              value['id'] = result.data.data

              allTags.push(value);
              tags.push(value)
              console.log(value)
              this.setState({
                tags: tags,
                allTags: allTags
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

    }
    this.setState({
      tags: tags,
      allTags: allTags
    })
  }

  manageTag() {
    const {isManage, disabled} = this.state
    this.setState({
      isManage: !isManage,
      disabled: !disabled
    })
  }

  removeTag(value) {
    console.log(value.name)
    Taro.showModal({
      title: '删除标签',
      content: '确认删除标签' + value.name,
    })
      .then(res => {
        if (res.confirm) {
          this.confirmRemoveTag(value)
        }
      })

  }

  confirmRemoveTag(tag) {
    const {tags, allTags} = this.state
    console.log(tag)
    Taro.request({
      url: HOST+ `/tags/` + tag.id,
      method: 'DELETE',
      success: result => {
        if (this.indexOfTag(allTags, tag.name) >= 0) {
          allTags.splice(this.indexOfTag(allTags, tag.name), 1);
        }
        if (this.indexOfTag(tags, tag.name) >= 0) {
          tags.splice(this.indexOfTag(tags, tag.name), 1)
        }
        this.setState({
          confirmDelete: '',
          tags: tags,
          allTags: allTags
        })
      },
      fail: error => {
        console.log('fail')
        console.log(error)
      }
    })
  }

  componentWillUnmount() {
    set("tags", this.state.tags)
  }

  render() {
    const {tags, allTags, isManage, disabled} = this.state
    return (

      <View className='panel'>
        <View className='cur-tags'>
          {tags.map((tag) =>
            <TagItem
              key={tag.id}
              tag={tag}
              disabled={disabled}
              isManage={false}
              onClick={this.handleClickTag.bind(this)}
              active={true}
            />
          )}
          <TagInput disabled={disabled} onAddNewTag={this.addNewTag.bind(this)} />
        </View>
        <View className='title'>
          <Text>
            所有标签
          </Text>
          {!isManage ? <Text /> :
            <AtButton onClick={this.manageTag.bind(this)} type='secondary' size='small'>
              取消
            </AtButton>
          }
        </View>
        <View className='all-tags'>
          <View className='all-tag-manage'>
            {allTags.map((tag) => {
              return <TagItem
                key={tag.id}
                onLongPress={this.manageTag.bind(this)}
                disabled={false}
                isManage={isManage}
                tag={tag}
                onRemoveTag={this.removeTag.bind(this)}
                onClick={this.handleClickTag.bind(this)}
                active={this.indexOfTag(tags, tag.name) >= 0}
              />
            })}
          </View>
        </View>
      </View>
    )
  }
}
