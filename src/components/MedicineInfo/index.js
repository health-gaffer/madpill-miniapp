import Taro, {
  useState,
  usePullDownRefresh,
} from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'
import BasicItem from "./BasicItem";
import MoreItem from "./MoreItem";
import MPDivider from "../MPDivider";

function Medicine(props) {

  const [showingInfoType, setShowingInfoType] = useState('basic');

  const basicItems = [
    {itemName: '药品名称', itemType: 'input', isRequired: true,},
    {itemName: '生产时间', itemType: 'date', isRequired: true,},
    {itemName: '保质天数', itemType: 'input', isRequired: true, inputType: 'number',},
    {itemName: '过期时间', itemType: 'date', isRequired: true,},
    {itemName: '用药说明', itemType: 'input', isRequired: true,},
    {itemName: '药品标签', itemType: 'tag', isRequired: false, tagContent: '头晕, 恶心', iconValue: 'chevron-right'},
  ];

  const moreItems =[
    {itemName: '适用症',},
    {itemName: '药品禁忌',},
  ]

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
                return <BasicItem className='at-row' key={index} item={item} />
              }
              return (
                <View>
                  <BasicItem className='at-row' key={index} item={item} />
                  <MPDivider />
                </View>
              )
            })
          }
        </View>

        <MPDivider color='#737373' />

        <View className='extras'>
          {
            moreItems.map((item, index) => {
              if (index === moreItems.length - 1) {
                return <MoreItem className='at-row' key={index} item={item} />
              }
              return (
                <View>
                  <MoreItem className='at-row' key={index} item={item} />
                  <MPDivider />
                </View>
              )
            })
          }
        </View>
      </View>

      <View className='operation'>
        {props.children}
      </View>

    </View>
  )
}

export default Medicine
