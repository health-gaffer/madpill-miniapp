import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './index.scss'
import MedicineTag from '../../components/MedicineTag'

export default class TagPage extends Component {
  config = {
    navigationBarTitleText: this.state.name,
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark'
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
      tags : ['感冒','发烧','鼻炎','治脚气'],
      allTags : ['感冒','发烧','鼻炎','治脚气','头疼']
    });
    Taro.setNavigationBarTitle({
      title: name
    });
  }

  onPullDownRefresh() {
    this.init()
  }

  init = () => {
    console.log('init')
  }

  render () {
    const { tags,allTags } = this.state
    return (
      <View className='panel'>
        <View className='cur-page'>
          {tags.map((tag) =>
            <MedicineTag key={tag} name={tag}/>
          )}
          <View>
        </View>
        <View className='all-page'>

        </View>
      </View>
    )
  }
}
