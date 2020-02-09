import Taro ,{
  useState
} from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'
import BasicItem from "../../components/MedicineInfo/BasicItem"

function Add() {

  const searchItem = {itemName: '药品名称', itemType: 'input', isRequired: true, iconValue: 'search'}

  const [showingResult, setShowingResult] = useState(false)

  const searchItemClicked = (e) => {
    if (e !== undefined && showingResult === false) {
      setShowingResult(true)
    }
  }

  return (
    <View>
      <View>
        {
          showingResult === false &&
          <View className='tip'>
            <View className='at-row at-row__justify--center'>
              <View className='at-article__h1'>
                输入一个药品名称
              </View>
            </View>
            <View className='at-row at-row__justify--center at-row--wrap'>
              <View className='at-col-12 at-article__h3'>
                <View className='at-row at-row__justify--center'>
                  通过药品名称搜索，您可以直接选择
                </View>
              </View>
              <View className='at-col-12 at-article__h3'>
                <View className='at-row at-row__justify--center'>
                  一种已记录的药品，自动补全相关信息～
                </View>
              </View>
            </View>
          </View>
        }
      </View>

      <View className={showingResult ? 'searched' : 'search'}>
        <BasicItem item={searchItem} onClicked={searchItemClicked} />
      </View>

      <View>
        {
          showingResult === true &&
          <View className='search-result'>
          </View>
        }
      </View>

    </View>
  )
}

Add.config = {
  navigationBarTitleText: '添加药品',
}

export default Add
