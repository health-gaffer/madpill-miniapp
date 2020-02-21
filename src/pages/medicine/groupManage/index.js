import Taro, {
  useRouter,
} from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'
import { set } from '../../../global'

function GroupManage() {

  const curRouter = useRouter()
  const curGroupId = curRouter.params.groupId

  return (
    <View>
      {
        curGroupId !== undefined &&
          <View>
            ${curGroupId}
          </View>
      }
    </View>
  )
}

GroupManage.config = {
  navigationBarTitleText: '群组管理',
}

export default GroupManage
