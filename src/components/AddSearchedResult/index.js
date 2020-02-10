import Taro, {
  useState,
  useEffect,
} from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'
import AddSearchedResultItem from "./AddSearchedResultItem"
import MPDivider from "../MPDivider"

function AddSearchedResult(props) {

  // 要搜索的药名
  const {query} = props

  const [result, setResult] = useState([]);

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

  // TODO 选择了药品，填充适用症和药品禁忌
  const resultItemClicked = (e) => {
  }

  return (
    <View>
      {
        result.map((item, index) => {
          return (
            <View key={index}>
              <AddSearchedResultItem item={item} onClicked={resultItemClicked} />
              <MPDivider />
            </View>
          )
        })
      }
    </View>
  )
}

export default AddSearchedResult
