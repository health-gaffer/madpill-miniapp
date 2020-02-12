import Taro, {
  useState,
} from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'

function Banner(props) {

  const [showingInfoType, setShowingInfoType] = useState('basic');

  const basicBannerClicked = () => {
    console.log('basicBannerClicked')
    setShowingInfoType('basic')

    Taro.pageScrollTo({
      scrollTop: 0
    })
  }

  const moreBannerClicked = () => {
    console.log('moreBannerClicked')
    setShowingInfoType('more')

    // TODO 适配机型
    Taro.pageScrollTo({
      scrollTop: 270
    })


  }

  return (
    <View className='banner at-row'>
      <View className='at-col-6'>
        <View className='at-row at-row__justify--end'>
          <View className='at-col--auto' onClick={basicBannerClicked}>
            <View className='at-row'>
              <View className='at-col--auto at-article__p'>
                基本信息
              </View>
            </View>

            {
              showingInfoType === 'basic' &&
              <View className='at-row'>
                <View
                  className={`indicator at-row ${showingInfoType === 'basic' ? 'indicator-show' : 'indicator-hide'}`}
                />
              </View>
            }
          </View>
          {/* 补空格 */}
          <View className='at-col-1' />
        </View>
      </View>

      <View className='at-col-6'>
        <View className='at-row at-row__justify--start'>
          {/* 补空格 */}
          <View className='at-col-1' />
          <View className='at-col--auto' onClick={moreBannerClicked}>
            <View className='at-row'>
              <View className='at-col--auto at-article__p'>
                更多信息
              </View>
            </View>
            {
              showingInfoType === 'more' &&
              <View className='at-row'>
                <View
                  className={`indicator at-row ${showingInfoType === 'more' ? 'indicator-show' : 'indicator-hide'}`}
                />
              </View>
            }
          </View>
        </View>
      </View>
    </View>
  )
}

export default Banner
