import Taro, {useCallback, useState} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtActivityIndicator} from "taro-ui"

import './index.scss'
import AddSearchedResultItem from "./AddSearchedResultItem"
import MPDivider from "../MPDivider"
import useDataApi from "../../hooks/useDataApi"
import {RESPONSE_CODE} from "../../constants"

function AddSearchedResult(props) {

  // 要搜索的药名
  const {query} = props
  const [result, setResult] = useState([])
  const [{data, isLoading, statusCode}, search] = useDataApi(
    'GET',
    `warehouse?query=${query}`,
    {queryResult: []},
  )

  // 数据加载后处理结果
  useCallback(() => {
    setResult(prevResult => {
      return prevResult.concat(data.queryResult)
    })
  }, [data])

  // 搜索名变化后重新搜索
  useCallback(() => {
    search(preRequest => {
      return {
        ...preRequest,
        url: `warehouse?query=${query}`,
      }
    })
  }, [query, search])

  const resultItemClicked = (item) => (e) => {
    console.log('resultItemClicked')
    console.log(item)
    console.log(e)

    Taro.navigateTo({
      url: `/pages/medicine/index?action=add&addMode=madpill&medicineId=${item.id}`
    })
  }

  // 加载更多时发起请求
  const moreClicked = () => {
    search(preRequest => {
      return {
        ...preRequest,
        url: `warehouse?query=${query}&start=${result.length}`
      }
    })
  }

  return (
    <View>
      <View>
        {
          statusCode === RESPONSE_CODE.OK &&
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
        }

        <View className='more at-row at-row__justify--center' onClick={moreClicked}>
          <View className='at-col-8'>
            <View className='at-row at-row__justify--center'>
              {
                statusCode !== RESPONSE_CODE.OK &&
                <View className='at-article__h3'>
                  似乎出了点什么问题 Σ（ﾟдﾟlll）
                </View>
              }

              {
                // 加载中
                statusCode === RESPONSE_CODE.OK &&
                isLoading === true &&
                <View>
                  <AtActivityIndicator color='#FB9828' />
                </View>
              }

              {
                statusCode === RESPONSE_CODE.OK &&
                isLoading === false &&
                data.queryResult.length !== 0 &&
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
                statusCode === RESPONSE_CODE.OK &&
                isLoading === false &&
                data.queryResult.length === 0 &&
                <View className='at-article__h3'>
                  真的一种都没有了 :-P
                </View>
              }
            </View>
          </View>
        </View>
      </View>

    </View>
  )
}

export default AddSearchedResult
