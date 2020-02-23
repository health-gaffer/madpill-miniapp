import Taro, {
  useEffect,
  useState,
} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtIcon} from 'taro-ui'

import './index.scss'

function MPFormItem(props) {

  // 项展示名称、展示形式
  const {label, vertical, rules} = props

  const [required, setRequired] = useState(false)
  useEffect(() => {
    console.log('MPFormItem useEffect rule')
    console.log(rules)
    rules.map(rule => rule.required === true ? setRequired(true): '')
  }, [rules])

  useEffect(() => {
    console.log('MPFormItem useEffect label')
    console.log(label)
  }, [label])

  return (
    <View className='form-item'>
      {
        vertical === false &&
        <View className='at-row at-row__align--center'>
          {/* 左部提示信息 */}
          <View className='left at-col-3'>
            <View className='at-row at-row__align--center at-row__justify--center'>
              <View className='at-col-2'>
                <View className='at-row at-row__justify--end'>
                  {
                    required &&
                    <AtIcon value='star-2' size='10' color='#F00' />
                  }
                </View>
              </View>
              <View className='at-col__offset-1 at-col-auto'>
                <View className='itemName at-row'>
                  {label}
                </View>
              </View>
            </View>
          </View>

          {/* 右部实际输入 */}
          <View className='right at-col__offset-1 at-col-8'>
            {props.children}
          </View>
        </View>
      }

      {
        vertical === true &&
        <View>
          {/* 上部提示信息 */}
          <View className='head at-row at-row__justify--center'>
            <View className='at-col--auto'>
              {label}
            </View>
          </View>

          {/* 下部实际输入 */}
          <View className='content at-row at-row__justify--center'>
            {props.children}
          </View>
        </View>
      }
    </View>
  )
}

MPFormItem.defaultProps = {
  label: '',
  vertical: false,
  rules: [],
}

export default MPFormItem
