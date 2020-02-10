import Taro, {
  useState
} from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtActionSheet, AtActionSheetItem  } from "taro-ui"

import './index.scss'
import MedicineInfo from "../../components/MedicineInfo"

function Medicine(props) {

  const {action = 'review'} = props

  const [deleteConfirmModalOpen, setDeleteComfirmModalOpen] = useState(false)

  const addClicked = () => {
    // TODO
    console.log('addClicked')
  }

  const modifyClicked = () => {
    // TODO
    console.log('modifyClicked')
  }

  const deleteClicked = () => {
    setDeleteComfirmModalOpen(true)
  }

  const deleteConfirmed = () => {
    // TODO
  }

  const deleteCancelled = () => {
    setDeleteComfirmModalOpen(false)
  }

  return (
    <MedicineInfo>
      <View className='action at-row at-row__justify--center'>
        <View className='at-col-8'>
          {
            action === 'new' &&
            <AtButton className='add' onClick={addClicked}>确认添加</AtButton>
          }

          {
            action === 'review' &&
            <View>
              <AtButton className='add' onClick={modifyClicked}>确认修改</AtButton>
              <AtButton className='delete' onClick={deleteClicked}>删除药品</AtButton>
            </View>
          }
        </View>
      </View>

      <AtActionSheet
        isOpened={deleteConfirmModalOpen}
        cancelText='取消'
        title='请您知悉，删除该药品该操作不可撤销！'
        onCancel={deleteCancelled}
        onClose={deleteCancelled}
      >
        <AtActionSheetItem onClick={deleteConfirmed}>
          <Text className='delete-confirm'>
            确认删除
          </Text>
        </AtActionSheetItem>
      </AtActionSheet>
    </MedicineInfo>
  )
}

Medicine.config = {
  navigationBarTitleText: '添加药品',
}

export default Medicine
