import Taro, {
  useState,
  usePullDownRefresh,
} from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'
import BasicItem from "../../components/Medicine/BasicItem";
import MoreItem from "../../components/Medicine/MoreItem";
import MPDivider from "../../components/MPDivider";

function Add() {

  const [showingInfoType, setShowingInfoType] = useState('basic');

  const basicItems = [
    {itemName: '药品名称', itemType: 'input', isRequired: true,},
    {itemName: '生产时间', itemType: 'date', isRequired: true,},
    {itemName: '保质天数', itemType: 'input', isRequired: true, inputType: 'number',},
    {itemName: '过期时间', itemType: 'date', isRequired: true,},
    {itemName: '用药说明', itemType: 'input', isRequired: true,},
    {itemName: '药品标签', itemType: 'tag', isRequired: false, tagContent: '头晕, 恶心',},
  ];

  usePullDownRefresh(() => {
    console.log('hello kk')
  })

  return (
    <View className='medicine'>
      <View className='photo at-row'>
      {/*  TODO */}
      </View>


      {/* banner TODO ref */}
      <View className='banner at-row'>
        <View className='at-col-6'>
          <View className='at-row at-row__justify--end'>
            <View className='at-col--auto'>
              <View className='at-row'>
                <View className='at-col--auto at-article__p'>
                  基本信息
                </View>
              </View>

              {
                showingInfoType === 'basic' &&
                <View className='at-row'>
                  <View className='indicator at-row'>
                  </View>
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
            <View className='at-col--auto'>
              <View className='at-row'>
                <View className='at-col--auto at-article__p'>
                  更多信息
                </View>
              </View>
              {
                showingInfoType === 'more' &&
                <View className='at-row'>
                  <View className='indicator at-row'>
                  </View>
                </View>
              }
            </View>
          </View>
        </View>
      </View>

      <View className='info'>
        <View className='basics'>
          {
            basicItems.map((item, index) => {
              if (index === basicItems.length - 1) {
                return <BasicItem className='at-row' key={index} item={item}>specific input {item}</BasicItem>
              }
              return (
                <View>
                  <BasicItem className='at-row' key={index} item={item}>specific input {item}</BasicItem>
                  <MPDivider />
                </View>
              )
            })
          }
        </View>

        <MPDivider color='#737373' />

        <View className='extras'>
          {
            basicItems.map(number => <MoreItem className='at-row' key={number}>specific input {number}</MoreItem>)
          }
        </View>
      </View>

    </View>
  )
}

Add.config = {
  navigationBarTitleText: '添加药品',
  enablePullDownRefresh: true,
}

export default Add
