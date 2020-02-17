import Taro, {
  useState,
  useEffect,
} from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'
import MedicineImage from "./MedicineImage"
import Banner from "./Banner"
import BasicItem from "./BasicItem"
import MoreItem from "./MoreItem"
import MPDivider from "../MPDivider"
import useDataApi from "../../hooks/useDataApi"
import {MADPILL_ADD_CONFIG, MADPILL_RESPONSE_CODE} from "../../constants"
import {calDateAfterAddDays, calDateDiffDays, getDateString} from "../../utils"

function MedicineInfo(props) {

  // basic 基本信息的高度，用于控制 ScrollView 滑动监听的距离
  const [infoBasicsHeight, setInfoBasicsHeight] = useState(0)

  // 控制子组件 banner 的显示与 ScrollView 的对应位置正确
  const [showingInfoType, setShowingInfoType] = useState('basic')

  // 监听页面的 scrollTop，以实现随滑动自动变更 banner
  useEffect(() => {
    if (props.scrollTop <= infoBasicsHeight) {
      if (showingInfoType !== 'basic') {
        setShowingInfoType('basic')
      }
    } else {
      if (showingInfoType !== 'more') {
        setShowingInfoType('more')
      }
    }
  }, [props.scrollTop])

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
    setMedicine(preMedicine => {
      return {
        ...preMedicine,
        period: calDateDiffDays(medicineRequestedData.producedDate, medicineRequestedData.expireDate)
      }
    })
  }, [medicineRequestedData])

  useEffect(() => {
    console.log('medicine info init')
    console.log(props.routerParams)
    initScreenHeight()
    initData()
  }, [props.routerParams])

  const initScreenHeight = () => {
    Taro.createSelectorQuery()
      .in(this.$scope)
      .select('.basics')
      .fields({
        size: true,
      }).exec(basicsRes => {
        // + 15 是为了遮挡中间的分割线
        setInfoBasicsHeight(basicsRes[0].height + 15)
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


  const dateRelatedLabels = ['producedDate', 'period', 'expireDate']
  const dateRelatedExtraProcess = (curItemLabel, curValue) => {
    if (curItemLabel === 'producedDate') {
      setMedicine(preMedicine => {
        return {
          ...preMedicine,
          expireDate: calDateAfterAddDays(curValue, preMedicine.period)
        }
      })
    } else if (curItemLabel === 'period') {
      setMedicine(preMedicine => {
        return {
          ...preMedicine,
          expireDate: calDateAfterAddDays(preMedicine.producedDate, curValue)
        }
      })
    } else if (curItemLabel === 'expireDate') {
      setMedicine(preMedicine => {
        return {
          ...preMedicine,
          period: calDateDiffDays(preMedicine.producedDate, curValue)
        }
      })
    }
  }

  const MedicineItemChanged = (curValue, itemLabel) => {
    // console.log('MedicineItemClicked')
    // console.log(curValue)
    // console.log(itemLabel)
    // if (itemLabel === 'period') {
    //  TODO regex and focus
    // }
    setMedicine(preMedicine => {
      preMedicine[itemLabel] = curValue
      return preMedicine
    })

    if (dateRelatedLabels.includes(itemLabel)) {
      dateRelatedExtraProcess(itemLabel, curValue)
    }
  }

  // 新增时设置初始化的时间
  const setDefaultDateWhenAdd = () => {
    setMedicine(preMedicine => {
      return {
        ...preMedicine,
        producedDate: getDateString(new Date()),
        expireDate: getDateString(new Date()),
        period: 0,
      }
    })
  }

  return (
    <View className='medicine'>
      <View className='image-and-banner'>
        <MedicineImage />
        <Banner
          basicsHeight={infoBasicsHeight}
          showingInfoType={showingInfoType}
        />
      </View>

      <View className='info'>
        <View className='basics' id='basic'>
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
                <View key={index}>
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

        <View className='mores' id='more'>
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
                <View key={index}>
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
