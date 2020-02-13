import Taro, {
  useState,
  useEffect,
} from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'

import './index.scss'
import MedicineImage from "./MedicineImage"
import Banner from "./Banner"
import BasicItem from "./BasicItem";
import MoreItem from "./MoreItem";
import MPDivider from "../MPDivider";
import { MADPILL_ADD_CONFIG } from "../../constants"

function MedicineInfo(props) {

  const [scrollViewHeight, setScrollViewHeight] = useState(0)
  const [infoBasicsHeight, setInfoBasicsHeight] = useState(0)

  const [action, setAction] = useState('add')
  const [addMode, setAddMode] = useState('direct')
  const [medicineId, setMedicineId] = useState(0)
  const [name, setName] = useState('')

  const basicItems = [
    {itemName: '药品名称', itemType: 'input', isRequired: true,},
    {itemName: '生产时间', itemType: 'date', isRequired: true,},
    {itemName: '保质天数', itemType: 'input', isRequired: true, inputType: 'number',},
    {itemName: '过期时间', itemType: 'date', isRequired: true,},
    {itemName: '用药说明', itemType: 'input', isRequired: true,},
    {itemName: '药品标签', itemType: 'tag', isRequired: false, tagContent: '头晕, 恶心', iconValue: 'chevron-right'},
  ];

  const moreItems = [
    {itemName: '适用症',},
    {itemName: '药品禁忌',},
  ]

  useEffect(() => {
    initScreenHeight()

    // TODO api 解析路由，向后端取数据 / 填充数据
  }, [scrollViewHeight])

  const initScreenHeight = () => {
    console.log('initScreenHeight')
    Taro.createSelectorQuery()
      .selectViewport()
      .fields({
        size: true
      }, viewpointRes => {
        Taro.createSelectorQuery()
          .in(this.$scope)
          .select('.image-and-banner')
          .fields({
            size: true,
          }).exec(imageAndBannerRes => {
          setScrollViewHeight(viewpointRes.height - imageAndBannerRes.height)
          console.log(viewpointRes.height - imageAndBannerRes[0].height)
        })
      }).exec()

    Taro.createSelectorQuery()
      .in(this.$scope)
      .select('.basics')
      .fields({
        size: true,
      }).exec(basicsRes => {
        // + 5 是为了遮挡中间的分割线
        setInfoBasicsHeight(basicsRes[0].height + 5)
    })
  }


  const basicItemClicked = (curValue) => {
    console.log('basicItemClicked')
    console.log(curValue)
  }


  const scrollStyle = {
    height: `${scrollViewHeight}px`
    // height: '150px'
  }
  const scrollTop = 0
  const Threshold = 20

  const onScrollToUpper = () => {
    console.log('onScrollToUpper')
  }

  const onScroll = (e) => {
    console.log(e.detail)
  }

  return (
    <View className='medicine'>
      <View className='image-and-banner'>
        <MedicineImage />
        <Banner basicsHeight={infoBasicsHeight} />
      </View>

      <ScrollView
        scrollY
        scrollWithAnimation
        scrollTop={scrollTop}
        style={scrollStyle}
        lowerThreshold={Threshold}
        upperThreshold={Threshold}
        onScrollToUpper={onScrollToUpper}
        onScroll={onScroll}
      >
        <View className='info'>
          <View className='basics'>
            {
              basicItems.map((item, index) => {
                if (index === basicItems.length - 1) {
                  return <BasicItem className='at-row' key={index} item={item} onClicked={basicItemClicked} />
                }
                return (
                  <View key={index} >
                    <BasicItem className='at-row' item={item} onClicked={basicItemClicked} />
                    <MPDivider />
                  </View>
                )
              })
            }
            <MPDivider type='dark-gray' />
          </View>

          <View className='mores'>
            {
              moreItems.map((item, index) => {
                if (index === moreItems.length - 1) {
                  return <MoreItem className='at-row' key={index} item={item} />
                }
                return (
                  <View key={index} >
                    <MoreItem className='at-row' item={item} />
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
      </ScrollView>

    </View>
  )
}

export default MedicineInfo
