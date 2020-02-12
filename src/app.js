import Taro, { Component } from '@tarojs/taro'
import TagPage from './pages/tagManage'

import './app.scss'
import './taro-custom-theme.scss'

import 'taro-ui/dist/style/index.scss'

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/tagManage/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'Mad Pill',
      navigationBarTextStyle: 'black'
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
