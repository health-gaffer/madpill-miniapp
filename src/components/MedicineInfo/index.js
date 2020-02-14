import Taro, {
  useState,
  useEffect,
  useRouter,
} from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'

import './index.scss'
import MedicineImage from "./MedicineImage"
import Banner from "./Banner"
import BasicItem from "./BasicItem"
import MoreItem from "./MoreItem"
import MPDivider from "../MPDivider"
import { MADPILL_ADD_CONFIG } from "../../constants"
import useDataApi from "../../hooks/useDataApi";

function MedicineInfo(props) {

  const curRouterParams = useRouter().params
  const [scrollViewHeight, setScrollViewHeight] = useState(0)
  const [infoBasicsHeight, setInfoBasicsHeight] = useState(0)

  const basicItems = [
    {itemLabel: 'name', itemName: '药品名称', itemType: 'input', isRequired: true,},
    {itemLabel: 'producedDate', itemName: '生产时间', itemType: 'date', isRequired: true,},
    {itemLabel: 'expireDate', itemName: '保质天数', itemType: 'input', isRequired: true, inputType: 'number',},
    {itemLabel: 'period', itemName: '过期时间', itemType: 'date', isRequired: true,},
    {itemLabel: 'description', itemName: '用药说明', itemType: 'input', isRequired: true,},
    {itemLabel: 'tags', itemName: '药品标签', itemType: 'tag', isRequired: false, tagContent: '头晕, 恶心', iconValue: 'chevron-right'},
  ];

  const moreItems = [
    {itemLabel: 'indication', itemName: '适用症',},
    {itemLabel: 'contraindication', itemName: '药品禁忌',},
  ]

  const [medicine, setMedicine] = useState({
    id: undefined,
    name: 'test',
    producedDate: '',
    expireDate: '',
    description: '1234567890',
    indication: '',
    contraindication: '',
    tags: ['感冒', '咳嗽'],
  })

  const [{data: warehouseRequestedData, isLoading: warehouseLoading, statusCode: warehouseStatusCode}, warehouseRequest] = useDataApi({
    requestMethod: 'GET',
    requestUrl: `warehouse/${curRouterParams.warehouseId}`,
    initialResultData: {},
  })

  // warehouseRequest 加载结果返回后设置本组件中药品 medicine 的相关信息
  useEffect(() => {
    console.log('warehouseRequest finish')
    console.log(warehouseRequestedData)
    setMedicine(preMedicine => {
      return {
        ...preMedicine,
        ...warehouseRequestedData,
      }
    })
  }, [warehouseRequestedData])

  const [{data: medicineRequestedData, isLoading: medicineLoading, statusCode: medicineStatusCode}, medicineRequest] = useDataApi({
    requestMethod: 'GET',
    requestUrl: `drugs/${curRouterParams.medicineId}`,
    initialResultData: {},
  })

  // medicineRequest 加载结果返回后设置本组件中药品 medicine 的相关信息
  useEffect(() => {
    console.log('medicineRequest finish')
    console.log(medicineRequestedData)
    setMedicine(medicineRequestedData)
  })

  useEffect(() => {
    console.log('medicine info init')
    console.log(curRouterParams)
    initScreenHeight()
    initData()
  }, [curRouterParams])

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

  const initData = () => {
    if (curRouterParams.action === MADPILL_ADD_CONFIG.ACTION_ADD) {
      // 新增界面
      if (curRouterParams.addMode === MADPILL_ADD_CONFIG.ADD_MODE_MADPILL) {
        // 从仓库新增
        console.log('---warehouse init---')
        warehouseRequest(preRequest => {
          return {
            ...preRequest,
            exec: true
          }
        })
      } else if (curRouterParams.addMode === MADPILL_ADD_CONFIG.ADD_MODE_DIRECT) {
        // 直接新增
        medicineRequest(preMedicine => {
          return {
            ...preMedicine,
            name: curRouterParams.manualName,
          }
        })
      }
    } else if (curRouterParams.action === MADPILL_ADD_CONFIG.ACTION_REVIEW) {
      // 查看修改删除界面
      medicineRequest(preRequest => {
        return {
          ...preRequest,
          exec: true
        }
      })
    }
  }


  const basicItemClicked = (itemLabel) => (curValue) => {
    console.log('basicItemClicked')
    console.log(curValue)
    setMedicine(preMedicine => {
      return {
        ...preMedicine,
        // TODO
        // ${itemLabel}: curValue
      }
    })
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
                  return <BasicItem
                    key={index}
                    className='at-row'
                    item={item}
                    value={medicine[item.itemLabel]}
                    onClicked={basicItemClicked}
                  />
                }
                return (
                  <View key={index} >
                    <BasicItem
                      className='at-row'
                      item={item}
                      value={medicine[item.itemLabel]}
                      onClicked={basicItemClicked}
                    />
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
