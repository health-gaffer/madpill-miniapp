import Taro, {useEffect, useState} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtActivityIndicator} from "taro-ui"

import './index.scss'
import AddSearchedResultItem from "./AddSearchedResultItem"
import MPDivider from "../MPDivider"
import useDataApi from "../../hooks/useDataApi"
import {MADPILL_RESPONSE_CODE} from "../../constants"

function AddSearchedResult(props) {

  // 要搜索的药名
  const {query} = props
  const [result, setResult] = useState([])
  const [{data, isLoading, statusCode}, search] = useDataApi(
    Taro.request.GET,
    `warehouse?query=${query}`,
    [],
  )

  // 数据加载后处理结果
  useEffect(() => {
    console.log('queried data received')
    setResult(prevResult => {
      return prevResult.concat(data)
    })
  }, [data])

  // 搜索名变化后重新搜索
  useEffect(() => {
    console.log('query word changed')
    setResult([])
    search(preRequest => {
      return {
        ...preRequest,
        url: `warehouse?query=${query}`,
      }
    })
  }, [query])

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
          statusCode === MADPILL_RESPONSE_CODE.OK &&
          <View>
            {
              result.map((item, index) => {
                return (
                  <View key={index} >
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
                statusCode !== MADPILL_RESPONSE_CODE.OK &&
                <View className='at-article__h3'>
                  似乎出了点什么问题 Σ（ﾟдﾟlll）
                </View>
              }

              {
                // 加载中
                statusCode === MADPILL_RESPONSE_CODE.OK &&
                isLoading === true &&
                <View>
                  <AtActivityIndicator color='#FB9828' />
                </View>
              }

              {
                statusCode === MADPILL_RESPONSE_CODE.OK &&
                isLoading === false &&
                data.length !== 0 &&
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
                statusCode === MADPILL_RESPONSE_CODE.OK &&
                isLoading === false &&
                data.length === 0 &&
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
