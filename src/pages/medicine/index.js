import Taro, {
  useEffect,
  usePageScroll,
  useRouter,
  useState,
} from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtMessage, AtActivityIndicator } from 'taro-ui'

import './index.scss'
import MedicineInfo from '../../components/MedicineInfo'
import useDataApi from '../../hooks/useDataApi'
import { MADPILL_ADD_CONFIG, MADPILL_RESPONSE_CODE } from '../../constants'
import { set } from '../../global'

function Medicine() {

  const curRouter = useRouter()
  const [curScrollTop, setCurScrollTop] = new useState(0)

  usePageScroll(res => {
    setCurScrollTop(res.scrollTop)
  })


  // TODO 由子组件 MedicineInfo 中的 medicine 管理，但因为 taro 目前不支持 useImperativeHandle + forwardRef，所以先冗余保存
  const [curMedicine, setCurMedicine] = useState({})

  const [{isLoading: addLoading, statusCode: addStatusCode}, addRequest] = useDataApi({
    requestMethod: 'POST',
    requestUrl: 'drugs',
  })

  const [{isLoading: modifyLoading, statusCode: modifyStatusCode}, modifyRequest] = useDataApi({
    requestMethod: 'PUT',
    requestUrl: `drugs/${curRouter.params.medicineId}`,
  })

  const [{isLoading: deleteLoading, statusCode: deleteStatusCode}, deleteRequest] = useDataApi({
    requestMethod: 'DELETE',
    requestUrl: `drugs/${curRouter.params.medicineId}`,
  })

  // 添加成功
  useEffect(() => {
    console.log(`add success ${addStatusCode}`)
    if (addStatusCode === MADPILL_RESPONSE_CODE.OK) {
      setGlobalMedicineUpdate('add','添加成功')
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
    console.log(`modify success ${modifyStatusCode}`)
    if (modifyStatusCode === MADPILL_RESPONSE_CODE.OK) {
      Taro.atMessage({
        message: '修改成功！',
        type: 'success',
      })

    } else {
      handleError(modifyStatusCode)
    }
  }, [modifyStatusCode])

  // 删除成功
  useEffect(() => {
    console.log(`delete success ${deleteStatusCode}`)
    if (deleteStatusCode === MADPILL_RESPONSE_CODE.OK) {
      setGlobalMedicineUpdate('delete','删除成功')
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
    console.log(`handleError ${errorCode}`)
    if (errorCode) {
      Taro.atMessage({
        message: errorCode,
        type: 'error',
      })
    }
  }


  // 校验药品信息的合法性
  const medicineValidityCheck = () => {
    const requiredRules = [
      {label: 'name', msg: '药品名称必填哦'},
      {label: 'producedDate', msg: '生产时间必填哦'},
      {label: 'expireDate', msg: '过期时间必填哦'},
    ]
    for (let i = 0; i < requiredRules.length; i++) {
      const rule = requiredRules[i]
      const checkedLabel = curMedicine[rule.label]
      if (checkedLabel === undefined || checkedLabel === '') {
        Taro.showToast({
          title: rule.msg,
          icon: 'none'
        })
        return false
      }
    }
    return true
  }

  const addClicked = () => {
    // console.log('ready to send data')
    // console.log(curMedicine)
    if (medicineValidityCheck()) {
      addRequest(prevRequest => {
        return {
          ...prevRequest,
          data: curMedicine,
          exec: true,
        }
      })
    }
  }

  const modifyClicked = () => {
    // console.log('ready to send data')
    // console.log(curMedicine)
    if (medicineValidityCheck()) {
      modifyRequest(prevRequest => {
        return {
          ...prevRequest,
          data: curMedicine,
          exec: true,
        }
      })
    }
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
      confirmColor: '#F00',
      success: res => {
        if (res.confirm) {
          console.log('delete confirmed')

          deleteRequest(prevRequest => {
            return {
              ...prevRequest,
              exec: true,
            }
          })
        }
      }
    })
  }

  const setGlobalMedicineUpdate = (code, msg) =>{
    const option = {}
    option['code'] = code;
    option['msg'] = msg;
    set('option', option)
  }

  const curMedicineChange = (m) => {
    setCurMedicine(m)
  }

  return (
    <View>
      <AtMessage />
      <MedicineInfo
        scrollTop={curScrollTop}
        routerParams={curRouter.params}
        onCurMedicineChange={curMedicineChange}
      >
        <View className='action at-row at-row__justify--center'>
          <View className='at-col-8'>
            {
              curRouter.params.action === MADPILL_ADD_CONFIG.ACTION_ADD &&
              <AtButton className='add' onClick={addClicked}>
                {
                  addLoading === true
                    ?
                    <View className='at-row at-row__justify--center at-row__align--center'>
                      <AtActivityIndicator className='at-col-2' color='white' />
                      <Text className='at-col--auto'>正在添加</Text>
                    </View>
                    :
                    <Text>确认添加</Text>
                }
              </AtButton>
            }

            {
              curRouter.params.action === MADPILL_ADD_CONFIG.ACTION_REVIEW &&
              <View>
                <AtButton className='add' onClick={modifyClicked}>
                  {
                    modifyLoading === true
                      ?
                      <View className='at-row at-row__justify--center at-row__align--center'>
                        <AtActivityIndicator className='at-col-2' color='white' />
                        <Text className='at-col--auto'>正在修改</Text>
                      </View>
                      :
                      <Text>确认修改</Text>
                  }
                </AtButton>
                <AtButton className='delete' onClick={deleteClicked}>
                  {
                    deleteLoading === true
                      ?
                      <View className='at-row at-row__justify--center at-row__align--center'>
                        <AtActivityIndicator className='at-col-2' color='#F00' />
                        <Text className='at-col--auto'>正在删除</Text>
                      </View>
                      :
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
