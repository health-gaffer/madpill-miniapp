import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from "taro-ui"

import './index.scss'
import MedicineInfo from "../../components/MedicineInfo"

function Medicine(props) {

  const {action = 'review'} = props

  return (
    <MedicineInfo>
      <View className='action'>
        <View className='at-row at-row__justify--center'>
          <View className='at-col-8'>
            {
              action === 'new' &&
              <AtButton className='add'>确认添加</AtButton>
            }

            {
              action === 'review' &&
              <View>
                <AtButton className='add'>确认修改</AtButton>
                <AtButton className='delete'>删除药品</AtButton>
              </View>
            }
          </View>
        </View>
      </View>
    </MedicineInfo>
  )
}

Medicine.config = {
  navigationBarTitleText: '添加药品',
}

export default Medicine
