import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from "taro-ui"

import './index.scss'
import MedicineInfo from "../../components/MedicineInfo"

function Medicine(props) {

  const {action = 'review'} = props

  const actionNewItems = [
    {type: 'add', msg: '确认添加',},
  ]
  const actionReviewItems = [
    {type: 'add', msg: '确认修改',},
    {type: 'delete', msg: '删除药品',},
  ]

  return (
    <MedicineInfo>
      <View className='action at-row at-row__justify--center'>
        <View className='at-col-8'>
          {
            action === 'new' &&
            actionNewItems.map((item, index) => {
              return <AtButton className={item.type} key={index}>{item.msg}</AtButton>
            })
          }

          {
            action === 'review' &&
            actionReviewItems.map((item, index) => {
              return <AtButton className={item.type} key={index}>{item.msg}</AtButton>
            })
          }
        </View>
      </View>
    </MedicineInfo>
  )
}

Medicine.config = {
  navigationBarTitleText: '添加药品',
}

export default Medicine
