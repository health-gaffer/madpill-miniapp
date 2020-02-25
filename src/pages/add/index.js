import Taro, {useState} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtButton} from 'taro-ui'

import './index.scss'
import AddSearchedResult from '../../components/AddSearchedResult'
import MPForm from '../../mpui/form';
import MPFormItem from '../../mpui/form-item';
import MPSearchBar from '../../mpui/search-bar';

function Add() {

  const [showingResult, setShowingResult] = useState(false)
  const [query, setQuery] = useState('')

  const searchItemChanged = (curQuery) => {
    setQuery(curQuery)

    if (curQuery !== undefined && curQuery !== '' && showingResult === false) {
      setShowingResult(true)
    }
  }

  const manuallyInputBtnClicked = () => {
    console.log('manuallyInputBtnClicked')
    console.log(query)

    Taro.navigateTo({
      url: `/pages/medicine/index?action=add&addMode=direct&manualName=${query}`
    })
  }

  return (
    <View className='container'>

      {/* 输入的提示信息 */}
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

      {/* 搜索框 */}
      <View className='search-bar'>
        <View className={showingResult ? 'searched' : 'search'}>
          <MPForm>
            <MPFormItem>
              <MPSearchBar
                keyword={query}
                placeholder='请输入药品名称'
                onChange={searchItemChanged}
              />
            </MPFormItem>
          </MPForm>
        </View>
      </View>

      <View className='result-view'>
        {/* 搜索结果*/}
        <View>
          {
            showingResult === true &&
            <View className='search-result'>
              <AddSearchedResult query={query}/>
            </View>
          }
        </View>
      </View>


      {/* 使用手动输入的结果 */}
      <View className='manually-view'>
        {
          showingResult === true &&
          <View className='manually-input at-row at-row__justify--center'>
            <View className='at-col-8'>
              <AtButton className='manual-btn' onClick={manuallyInputBtnClicked}>使用输入的药品名称</AtButton>
            </View>
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
