import Taro, {
  useState,
  useEffect,
} from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtActivityIndicator } from "taro-ui"

import './index.scss'
import AddSearchedResultItem from "./AddSearchedResultItem"
import MPDivider from "../MPDivider"

function AddSearchedResult(props) {

  // 要搜索的药名
  const {query} = props
  const [result, setResult] = useState([])

  // hasMore: 加载更多; loading: 加载中; noMore: 没有更多
  const MORE_STATE_HAS_MORE = 'hasMore'
  const MORE_STATE_LOADING = 'loading'
  const MORE_STATE_NO_MORE = 'noMore'
  const [more, setMore] = useState(MORE_STATE_HAS_MORE)

  useEffect(() => {
    search()
  }, [query])

  // TODO 向后端搜索数据
  const search = () => {
    const curResult = [
      {name: '奥硝唑片', vendor: '潇然'},
      {name: '左奥硝唑氯化钠注射液', vendor: '潇然'},
      {name: '奥沙利铂', vendor: '潇然'},
      {name: '替吉奥胶囊', vendor: '潇然'},
      {name: '奥美拉唑肠溶胶囊', vendor: '潇然'},
      {name: '奥替拉西钾', vendor: '潇然'},
      {name: '注射用奥扎格雷钠', vendor: '潇然'},
      {name: '磷酸奥司他韦胶囊', vendor: '潇然'},
      {name: '奥氮平片', vendor: '潇然'},
      {name: '奥拉西坦胶囊', vendor: '潇然'},
    ]

    setResult(curResult);
  }

  // TODO 选择了药品，跳转页面，填充适用症和药品禁忌
  const resultItemClicked = (item) => (e) => {
    console.log('resultItemClicked')
    console.log(item)
    console.log(e)

    Taro.navigateTo({
      url: '/pages/medicine/index'
    })
  }

  const moreClicked = () => {
    console.log('hello')
    // 只有点击时是 加载更多 需要处理
    if (more !== MORE_STATE_HAS_MORE) return

    setMore(MORE_STATE_LOADING)
    // TODO 后端加载数据
    setResult(prevState => {
      prevState.push(
        {name: '替吉奥胶囊', vendor: '潇然'},
        {name: '奥美拉唑肠溶胶囊', vendor: '潇然'}
      )
      return prevState
    })

    setMore(MORE_STATE_HAS_MORE)
  }

  return (
    <View>
      <View>
        {
          result.map((item, index) => {
            return (
              <View key={index} onClick={resultItemClicked(item)}>
                <AddSearchedResultItem item={item} />
                <MPDivider />
              </View>
            )
          })
        }
      </View>

      <View className='more at-row at-row__justify--center' onClick={moreClicked}>
        <View className='at-col-8'>
          <View className='at-row at-row__justify--center'>
            {
              more === MORE_STATE_HAS_MORE &&
                <View>
                  <View className='at-article__h3'>
                    加载更多
                  </View>
                  <View className='at-row at-row__justify--center'>
                    <View className='madpill icon-more' />
                  </View>
                </View>
            }

            {
              more === MORE_STATE_LOADING &&
              <View>
                <AtActivityIndicator color='#FB9828' />
              </View>

            }

            {
              more === MORE_STATE_NO_MORE &&
              <View className='at-article__h3'>
                真的一种都没有了orz
              </View>
            }
          </View>
        </View>
      </View>
    </View>
  )
}

export default AddSearchedResult
