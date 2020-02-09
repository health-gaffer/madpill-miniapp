import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'

import './app.scss'
import './taro-custom-theme.scss'


class App extends Component {

  componentDidMount () {}

  config = {
    pages: [
      'pages/index/index',
      'pages/add/index',
      'pages/medicine/index',
    ],
    window: {
      navigationBarBackgroundColor: '#fff',
      navigationBarTextStyle: 'black',
      navigationBarTitleText: 'MadPill',
      backgroundTextStyle: 'dark',
    }
  }


  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError (err) {
    console.error(err)
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
