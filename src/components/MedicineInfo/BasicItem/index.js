import Taro, { useEffect, useState } from '@tarojs/taro'
import { View, Text, Picker, Input } from '@tarojs/components'
import { AtIcon }  from 'taro-ui'

import './index.scss'

function BasicItem(props) {

  // 项展示名称、项类型、是否必须、输入类型、标签展示内容
  const {itemLabel, itemName, itemType, isRequired, inputType = 'text', iconValue = ''} = props.item
  const [value, setValue] = useState(props.value)

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  const handleChange = (curItemLabel) => (e) => {
    // TODO tag 修改后回调
    // console.log(curItemLabel)
    // console.log(e)
    setValue(e.target.value)
    props.onClicked(e.target.value, curItemLabel)
    return e.target.value
  }

  const representAtTag = () => {
    // console.log('representAtTag')
    return value.map(tag => tag.name).join(', ')
  }

  return (
    <View className='basic-item at-row at-row__align--center'>
      {/* 左部提示信息 */}
      <View className='left at-col-3'>
        <View className='at-row at-row__align--center at-row__justify--center'>
          <View className='at-col-2'>
            <View className='at-row at-row__justify--end'>
              {
                isRequired &&
                <AtIcon value='star-2' size='10' color='#F00' />
              }
            </View>
          </View>
          <View className='at-col__offset-1 at-col-auto'>
            <View className='itemName at-row'>
              {itemName}
            </View>
          </View>
        </View>
      </View>

      {/* 右部实际输入 */}
      <View className='right at-col__offset-1 at-col-8'>
        <View className='at-row'>
          {
            // 普通输入框
            itemType === 'input' &&
            <View className='at-col-10'>
              <Input
                name={itemName}
                type={inputType}
                placeholder={`请输入${itemName}`}
                value={value}
                onChange={handleChange(itemLabel)}
              />
            </View>
          }

          {
            // 日期选择器
            itemType === 'date' &&
            <Picker mode='date' value={value} onChange={handleChange(itemLabel)}>
              <View className='picker'>
                {value}
              </View>
            </Picker>
          }

          {
            // 不可输入的标签
            itemType === 'tag' &&
              <View className='at-col-10'>
                <Input
                  disabled
                  name={itemName}
                  type={inputType}
                  placeholder={representAtTag()}
                  placeholderClass='tag'
                  maxLength={12}
                />
              </View>
          }

          {
            // 最右的图标
            (itemType === 'input' || itemType === 'tag') &&
            <View className='at-col-2'>
              <View className='at-row at-row__justify--end'>
                {value.length > 12 &&
                <Text className='tag'>
                  ...
                </Text>
                }
                <AtIcon value={iconValue} size='16' color='#AEAEAE' />
              </View>
            </View>
          }
        </View>
      </View>
    </View>
  )
}

BasicItem.defaultProps = {
  item: {},
  value: []
}

export default BasicItem
