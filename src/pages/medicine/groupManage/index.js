import Taro, {
  useEffect,
  useRouter,
  useState,
} from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtRadio } from 'taro-ui'

import useDataApi from '../../../hooks/useDataApi'
import {MADPILL_RESPONSE_CODE} from '../../../constants'
import { set } from '../../../global'

function GroupManage() {

  const curRouter = useRouter()
  const curGroupId = curRouter.params.groupId

  const [groupOptions, setGroupOptions] = useState([])
  const [chosenGroupId, setChosenGroupId] = useState(curGroupId)

  useEffect(() => {
    console.log('to change global')
    for (let i = 0; i < data.length; i++) {
      if (String(data[i].id) === chosenGroupId) {
        set('group', data[i])
      }
    }
  })

  const [{data, isLoading, statusCode}] = useDataApi({
    requestMethod: 'GET',
    requestUrl: '/groups',
    initialResultData: [],
    execNow: true,
  })

  // 加载群组数据
  useEffect(() => {
    let presentData = []
    for (let i = 0; i < data.length; i++) {
      presentData.push({
        label: data[i].name,
        value: String(data[i].id),
      })
    }
    console.log('presentData')
    console.log(presentData)
    setGroupOptions(presentData)
  }, [data])

  // 加载中的相关处理
  useEffect(() => {
    if (isLoading) {
      Taro.showLoading({
        title: '加载中(/ω＼)',
        mask: true,
      })
    } else {
      Taro.hideLoading()
    }
  }, [isLoading])

  // 错误的处理
  useEffect(() => {
    if (statusCode !== MADPILL_RESPONSE_CODE.OK) {
      Taro.showToast({
        title: '群组加载失败(ToT)/~~~请稍后再试',
        icon: 'none'
      })
    }
  }, [statusCode])

  const handleChange = (value) => {
    setChosenGroupId(value)
  }

  return (
    <View>
      <View>
        <AtRadio
          options={groupOptions}
          value={chosenGroupId}
          onClick={handleChange}
        />
      </View>
    </View>
  )
}

GroupManage.config = {
  navigationBarTitleText: '群组管理',
}

export default GroupManage
