import Taro, {
  useState,
  useEffect,
} from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'
import MedicineImage from './MedicineImage'
import Banner from './Banner'
import MPDivider from '../MPDivider'
import MPForm from '../../mpui/form'
import MPFormItem from '../../mpui/form-item'
import MPInput from '../../mpui/input'
import MPDatePicker from '../../mpui/date-picker'
import MPInputNavigation from '../../mpui/input-navigation'
import MPTextArea from '../../mpui/input-textarea'
import useDataApi from '../../hooks/useDataApi'
import {MADPILL_ADD_CONFIG, MADPILL_RESPONSE_CODE} from '../../constants'
import {getDateString, getTodayOfLastYear} from '../../utils'

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

  const [medicine, setMedicine] = useState({
    id: undefined,
    name: '',
    producedDate: '',
    expireDate: '',
    group: {
      id: '',
      name: '',
    },
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


  const medicineItemChanged = (curValue, mpid) => {
    // console.log('medicineItemChanged')
    // console.log(`${mpid}: ${curValue}`)
    setMedicine(preMedicine => {
      preMedicine[mpid] = curValue
      return preMedicine
    })
  }

  // 新增时设置初始化的时间
  const setDefaultDateWhenAdd = () => {
    setMedicine(preMedicine => {
      const curDate = new Date()
      return {
        ...preMedicine,
        producedDate: getDateString(getTodayOfLastYear(curDate)),
        expireDate: getDateString(curDate),
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
        <MPForm>
            <MPFormItem label='药品名称'>
              <MPInput
                mpid='name'
                value={medicine.name}
                placeholder='请输入药品名称'
                onItemChange={medicineItemChanged}
              />
            </MPFormItem>
            <MPFormItem label='生产日期'>
              <MPDatePicker
                mpid='producedDate'
                value={medicine.producedDate}
                onItemChange={medicineItemChanged}
              />
            </MPFormItem>
            <MPFormItem label='有效期至'>
              <MPDatePicker
                mpid='expireDate'
                value={medicine.expireDate}
                onItemChange={medicineItemChanged}
              />
            </MPFormItem>
            <MPFormItem label='所属群组'>
              <MPInputNavigation
                mpid='group'
                value={medicine.group}
                iconValue='chevron-right'
                urlToNavigate={`/pages/medicine/groupManage/index?groupId=${medicine.group.id}`}
                represent={() => medicine.group.name}
                onItemChange={medicineItemChanged}
              />
            </MPFormItem>
            <MPFormItem label='用药说明'>
              <MPInput
                mpid='description'
                value={medicine.description}
                placeholder='请输入用药说明'
                onItemChange={medicineItemChanged}
              />
            </MPFormItem>
            <MPFormItem label='药品标签'>
              <MPInputNavigation
                mpid='tags'
                value={medicine.tags}
                iconValue='chevron-right'
                urlToNavigate={`/pages/medicine/tagManage/index?tags=${JSON.stringify(medicine.tags)}`}
                represent={() => medicine.tags.map(tag => tag.name).join(', ')}
                onItemChange={medicineItemChanged}
              />
            </MPFormItem>

            <MPDivider type='dark-gray' />

            <MPFormItem label='适用症' vertical>
              <MPTextArea
                mpid='indication'
                value={medicine.indication}
                placeholder='请输入适用症'
              />
            </MPFormItem>
            <MPFormItem label='药品禁忌' vertical>
              <MPTextArea
                mpid='contraindication'
                value={medicine.contraindication}
                placeholder='请输入药品禁忌'
              />
            </MPFormItem>
          </MPForm>
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
