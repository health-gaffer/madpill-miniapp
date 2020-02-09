import Taro, { useState } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { AtInput,AtIcon, AtList, AtListItem }  from 'taro-ui'

import './index.scss'

import {getDate} from "../../../utils";

function BasicItem(props) {

  const {itemName, itemType, isRequired} = props.item;
  const [value, setValue] = useState('');
  const [curDate, setCurDate] = useState(getDate(new Date()));

  const handleChange = (cur) => {
    setValue(cur)
    return cur
  }

  return (
    <View className='basic-item at-row at-row__align--center'>
      {/* 左部提示信息 */}
      <View className='left at-col-3'>
        <View className='at-row at-row__align--center at-row__justify--center'>
          <View className='at-col-2'>
            <View className='at-row at-row__justify--end'>
              {isRequired &&
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
        {itemType === 'input' &&
        <AtInput
          name={itemName}
          type='text'
          placeholder={'请输入' + itemName}
          border={false}
          value={value}
          onChange={handleChange}
        />
        }

        {itemType === 'date' &&
        <Picker mode='date' value={curDate} >
          <View className='picker'>
            {curDate}
          </View>
        </Picker>
        }

        {itemType === 'tag' &&
        <AtList hasBorder={false}>
          <AtListItem hasBorder={false} note='头晕, 恶心' arrow='right' />
        </AtList>
        }
      </View>
    </View>
  )
}

export default BasicItem
