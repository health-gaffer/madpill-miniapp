import Taro, {
  useState,
  useEffect,
} from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'

import './index.scss'
import MedicineImage from "./MedicineImage"
import Banner from "./Banner"
import BasicItem from "./BasicItem"
import MoreItem from "./MoreItem"
import MPDivider from "../MPDivider"
import useDataApi from "../../hooks/useDataApi"
import {MADPILL_ADD_CONFIG, MADPILL_RESPONSE_CODE} from "../../constants"
import { getDate } from "../../utils"

function MedicineInfo(props) {

  const [scrollViewHeight, setScrollViewHeight] = useState(0)
  const [infoBasicsHeight, setInfoBasicsHeight] = useState(0)

  const basicItems = [
    {itemLabel: 'name', itemName: '药品名称', itemType: 'input', isRequired: true,},
    {itemLabel: 'producedDate', itemName: '生产时间', itemType: 'date', isRequired: true,},
    {itemLabel: 'period', itemName: '保质天数', itemType: 'input', isRequired: true, inputType: 'number',},
    {itemLabel: 'expireDate', itemName: '过期时间', itemType: 'date', isRequired: true,},
    {itemLabel: 'description', itemName: '用药说明', itemType: 'input', isRequired: false,},
    {itemLabel: 'tags', itemName: '药品标签', itemType: 'tag', isRequired: false, iconValue: 'chevron-right'},
  ]
  const moreItems = [
    {itemLabel: 'indication', itemName: '适用症',},
    {itemLabel: 'contraindication', itemName: '药品禁忌',},
  ]

  const [medicine, setMedicine] = useState({
    id: undefined,
    name: '',
    producedDate: '',
    expireDate: '',
    period: 0,
    description: '',
    indication: JSON.stringify({
      content: ''
    }),
    contraindication: JSON.stringify({
      content: ''
    }),
    tags: [],
  })

 useEffect(() => {
   props.onCurMedicineChange(medicine)
 }, [medicine, props])

  const [{data: warehouseRequestedData, isLoading: warehouseLoading, statusCode: warehouseStatusCode}, warehouseRequest] = useDataApi({
    requestMethod: 'GET',
    requestUrl: `warehouse/${props.routerParams.warehouseId}`,
    initialResultData: {},
  })

  // warehouseRequest 加载结果返回后设置本组件中药品 medicine 的相关信息
  useEffect(() => {
    // console.log('warehouseRequest finish')
    // console.log(warehouseRequestedData)
    setMedicine(preMedicine => {
      return {
        ...preMedicine,
        ...warehouseRequestedData,
      }
    })
  }, [warehouseRequestedData])

  const [{data: medicineRequestedData, isLoading: medicineLoading, statusCode: medicineStatusCode}, medicineRequest] = useDataApi({
    requestMethod: 'GET',
    requestUrl: `drugs/${props.routerParams.medicineId}`,
    initialResultData: {},
  })

  // medicineRequest 加载结果返回后设置本组件中药品 medicine 的相关信息
  useEffect(() => {
    // console.log('medicineRequest finish')
    // console.log(medicineRequestedData)
    setMedicine(medicineRequestedData)
  }, [medicineRequestedData])

  useEffect(() => {
    console.log('medicine info init')
    console.log(props.routerParams)
    initScreenHeight()
    initData()
  }, [props.routerParams])

  const initScreenHeight = () => {
    // console.log('initScreenHeight')
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
    if (props.routerParams.action === MADPILL_ADD_CONFIG.ACTION_ADD) {
      // 新增界面
      setDefaultDateWhenAdd()
      if (props.routerParams.addMode === MADPILL_ADD_CONFIG.ADD_MODE_MADPILL) {
        // 从仓库新增
        warehouseRequest(preRequest => {
          return {
            ...preRequest,
            exec: true
          }
        })
      } else if (props.routerParams.addMode === MADPILL_ADD_CONFIG.ADD_MODE_DIRECT) {
        // 直接新增
        setMedicine(preMedicine => {
          return {
            ...preMedicine,
            name: props.routerParams.manualName,
          }
        })
      }
    } else if (props.routerParams.action === MADPILL_ADD_CONFIG.ACTION_REVIEW) {
      // 查看修改删除界面
      medicineRequest(preRequest => {
        return {
          ...preRequest,
          exec: true
        }
      })
    }
  }

  // 加载中的相关处理
  useEffect(() => {
    // console.log(`warehouseLoading: ${warehouseLoading}`)
    // console.log(`medicineLoading: ${medicineLoading}`)
    if (warehouseLoading || medicineLoading) {
      Taro.showLoading({
        title: '加载中(/ω＼)',
        mask: true,
      })
    } else {
      Taro.hideLoading()
    }
  }, [warehouseLoading, medicineLoading])

  // 错误的处理
  useEffect(() => {
    // console.log(`warehouseStatusCode: ${warehouseStatusCode}`)
    // console.log(`medicineStatusCode: ${medicineStatusCode}`)
    if (!(warehouseStatusCode === undefined || warehouseStatusCode === MADPILL_RESPONSE_CODE.OK)) {
      Taro.showToast({
        title: '初始化药品失败(ToT)/~~~',
        icon: 'none'
      })
    }

    if (!(medicineStatusCode === undefined || medicineStatusCode === MADPILL_RESPONSE_CODE.OK)) {
      Taro.showToast({
        title: '查找药品失败(ToT)/~~~',
        icon: 'none'
      })
    }
  }, [warehouseStatusCode, medicineStatusCode])



  const MedicineItemChanged = (curValue, itemLabel) => {
    // console.log('MedicineItemClicked')
    // console.log(curValue)
    // console.log(itemLabel)
    setMedicine(preMedicine => {
      preMedicine[itemLabel] = curValue
      return preMedicine
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

  // 新增时设置初始化的时间
  const setDefaultDateWhenAdd = () => {
    setMedicine(preMedicine => {
      return {
        ...preMedicine,
        producedDate: getDate(new Date()),
        expireDate: getDate(new Date()),
        period: 0,
      }
    })
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
                    onItemChange={MedicineItemChanged}
                  />
                }
                return (
                  <View key={index} >
                    <BasicItem
                      className='at-row'
                      item={item}
                      value={medicine[item.itemLabel]}
                      onItemChange={MedicineItemChanged}
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
                  return <MoreItem
                    key={index}
                    className='at-row'
                    item={item}
                    value={medicine[item.itemLabel]}
                    onItemChange={MedicineItemChanged}
                  />
                }
                return (
                  <View key={index} >
                    <MoreItem
                      className='at-row'
                      item={item}
                      value={medicine[item.itemLabel]}
                      onItemChange={MedicineItemChanged}
                    />
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

MedicineInfo.defaultProps = {
  routerParams: {
    action: '',
    addMode: '',
    warehouseId: '',
    manualName: '',
    medicineId: '',
  }
}

export default MedicineInfo
