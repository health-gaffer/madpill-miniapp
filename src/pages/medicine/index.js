import Taro, {
  useState,
  useEffect,
  useRouter,
} from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtActionSheet, AtActionSheetItem  } from "taro-ui"

import './index.scss'
import MedicineInfo from "../../components/MedicineInfo"
import { MADPILL_ADD_CONFIG } from "../../constants"

function Medicine() {

  const [deleteConfirmModalOpen, setDeleteComfirmModalOpen] = useState(false)
  const curRouter = useRouter()
  const [action, setAction] = useState('add')

  /**
   * 路由参数规则
   * action: 'add' (新增)
   *        addMode: 'madpill' (选取已有的药品)
   *                medicineId: $id (药品ID)
   *        addMode: 'direct' (直接输入)
   *                name: $name (药品名称)
   * action: 'review' (查看)
   *        medicineId: $id (药品ID)
   */
  useEffect(() => {
    setAction(curRouter.params.action)
  }, [curRouter])

  const addClicked = () => {
    // TODO api
    console.log('addClicked')

    // 关闭上两层添加页面，以便可以直接返回首页
    Taro.navigateBack({
      delta: 10
    }).then((res) => {
      // 页面在执行 navigateTo 的时候，上述关闭动画未执行完成，导致真机上页面打开失败，故需要在 then 中调用
      Taro.navigateTo({
        url: '/pages/added/index'
      })
    })
  }

  const modifyClicked = () => {
    // TODO api
    console.log('modifyClicked')
  }

  const deleteClicked = () => {
    setDeleteComfirmModalOpen(true)
  }

  const deleteConfirmed = () => {
    // TODO api
  }

  const deleteCancelled = () => {
    setDeleteComfirmModalOpen(false)
  }

  return (
    <MedicineInfo routeParams={curRouter.params}>
      <View className='action at-row at-row__justify--center'>
        <View className='at-col-8'>
          {
            action === MADPILL_ADD_CONFIG.ACTION_ADD &&
            <AtButton className='add' onClick={addClicked}>确认添加</AtButton>
          }

          {
            action === MADPILL_ADD_CONFIG.ACTION_REVIEW &&
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
