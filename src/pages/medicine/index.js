import Taro, {
  useEffect,
  useRouter,
} from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtMessage } from "taro-ui"

import './index.scss'
import MedicineInfo from "../../components/MedicineInfo"
import useDataApi from "../../hooks/useDataApi";
import { MADPILL_RESPONSE_CODE } from "../../constants"

function Medicine() {

  /**
   * 路由参数规则
   * action: 'add' (新增)
   *        addMode: 'madpill' (选取已有的药品)
   *                manufactureId: $manufactureId (仓库药名ID)
   *        addMode: 'direct' (直接输入)
   *                manualName: $manualName (药品名称)
   * action: 'review' (查看)
   *        medicineId: $id (药品ID)
   */
  const curRouter = useRouter()
  const ACTION_ADD = 'add'
  const ACTION_REVIEW = 'review'

  const [{isLoading: addLoading, statusCode: addStatusCode}, addRequest] = useDataApi(
    Taro.request.POST, '', {}, {},
  )

  const [{isLoading: modifyLoading, statusCode: modifyStatusCode}, modifyRequest] = useDataApi(
    Taro.request.PUT, '', {}, {},
  )

  const [{isLoading: deleteLoading, statusCode: deleteStatusCode}, deleteRequest] = useDataApi(
    Taro.request.DELETE, '',
  )

  // 添加成功
  useEffect(() => {
    if (addStatusCode === MADPILL_RESPONSE_CODE.OK) {
      // 关闭上两层添加页面，以便可以直接返回首页
      Taro.navigateBack({
        delta: Taro.getCurrentPages().length
      }).then((res) => {
        // 页面在执行 navigateTo 的时候，上述关闭动画未执行完成，导致真机上页面打开失败，故需要在 then 中调用
        Taro.navigateTo({
          url: '/pages/added/index'
        })
      })
    } else {
      handleError(addStatusCode)
    }
  }, [addStatusCode])

  // 修改成功
  useEffect(() => {
    if (modifyStatusCode === MADPILL_RESPONSE_CODE.OK) {
      returnToHome()
    } else {
      handleError(modifyStatusCode)
    }
  }, [modifyStatusCode])

  // 删除成功
  useEffect(() => {
    if (deleteStatusCode === MADPILL_RESPONSE_CODE.OK) {
      returnToHome()
    } else {
      handleError(deleteStatusCode)
    }
  }, [deleteStatusCode])

  // 返回首页
  const returnToHome = () => {
    // 关闭上两层添加页面，以便可以直接返回首页
    Taro.navigateBack({
      delta: Taro.getCurrentPages().length
    })
  }

  // 处理错误
  const handleError = (errorCode) => {
    // TODO 精细化处理错误
    console.log(errorCode)
    Taro.atMessage({
      message: errorCode,
      type: 'error',
    })
  }

  const addClicked = () => {
    console.log('addClicked')
    addRequest(prevRequest => {
      return {
        ...prevRequest,
        url: `drugs`,
        // TODO
        data: {}
        // TODO successCallback
      }
    })
  }

  const modifyClicked = () => {
    console.log('modifyClicked')

    modifyRequest(prevRequest => {
      return {
        ...prevRequest,
        url: `drugs/${curRouter.params.medicineId}`,
        // TODO
        data: {}
      }
    })
  }

  const deleteClicked = () => {

    // Taro.showActionSheet({
    //   itemList: ['确认删除'],
    //   itemColor: '#F00'
    // }).then(() => {
    //   console.log('delete confirmed')
    // }).catch(err => {
    //   console.log(err.errMsg)
    // })

    Taro.showModal({
      title: '删除药品',
      content: '请您知悉，删除该药品后操作不可撤销！',
      confirmText: '删除',
      confirmColor: '#F00'
    }).then(() => {
      console.log('delete confirmed')

      deleteRequest(prevRequest => {
        return {
          ...prevRequest,
          url: `drugs/${curRouter.params.medicineId}`,
        }
      })
    }).catch(err => {
      console.log(err.errMsg)
    })
  }

  return (
    <View>
      <AtMessage />
      <MedicineInfo routeParams={curRouter.params}>
        <View className='action at-row at-row__justify--center'>
          <View className='at-col-8'>
            {
              curRouter.params.action === ACTION_ADD &&
              <AtButton className='add' onClick={addClicked}>
                {
                  addLoading === true ?
                    <Text>正在添加</Text> :
                    <Text>确认添加</Text>
                }
              </AtButton>
            }

            {
              curRouter.params.action === ACTION_REVIEW &&
              <View>
                <AtButton className='add' onClick={modifyClicked}>
                  {
                    modifyLoading === true ?
                      <Text>正在修改</Text> :
                      <Text>确认修改</Text>
                  }
                </AtButton>
                <AtButton className='delete' onClick={deleteClicked}>
                  {
                    deleteLoading === true ?
                      <Text>正在删除</Text> :
                      <Text>删除药品</Text>
                  }
                </AtButton>
              </View>
            }
          </View>
        </View>
      </MedicineInfo>
    </View>
  )
}

Medicine.config = {
  navigationBarTitleText: '添加药品',
}

export default Medicine
