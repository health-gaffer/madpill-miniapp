import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'

function Banner(props) {

  const {showingInfoType} = props

  const basicBannerClicked = () => {
    // console.log('basicBannerClicked')
    props.onShowingInfoTypeChange('basic')
  }

  const moreBannerClicked = () => {
    // console.log('moreBannerClicked')
    props.onShowingInfoTypeChange('more')
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

Banner.defaultProps ={
  basicsHeight: 0
}

export default Banner
