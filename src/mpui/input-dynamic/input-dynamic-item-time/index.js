import {Input, View} from '@tarojs/components'
import {AtButton, AtIcon} from 'taro-ui'
import MPPicker from '../../picker'

import './index.scss'

function MPInputDynamicItemTime(props) {

  // 项索引ID、
  const {time, index} = props

  // 保存当前的值，以避免未修改重复渲染
  const preTime = time

  const timeChanged = (curTime) => {
    if (curTime !== preTime) {
      props.onChange(index, curTime)
    }
  }

  const onDeleteClick = () => {
    props.onDelete(index)
  }

  const onAddClick = () => {
    props.onAdd()
  }

  return (
    <View className='dynamic-item at-row at-row__justify--between'>
      <View className='at-col--auto'>
        {
          time !== undefined &&
          <MPPicker
            value={time}
            mode='time'
            onItemChange={timeChanged}
          />
        }

        {
          time === undefined &&
          <View>
            <Input
              disabled
              type='text'
              placeholder='轻点添加一个提醒吧'
            />
          </View>
        }
      </View>
      <View className='at-col--auto'>
        <View className='at-row at-row__justify--end'>
          {
            time !== undefined &&
            <AtButton className='input-dynamic-item-time-delete-btn' onClick={onDeleteClick}>
              <AtIcon value='close-circle' size='16' />
            </AtButton>
          }

          {
            time === undefined &&
            <AtButton className='input-dynamic-item-time-add-btn' onClick={onAddClick}>
              <AtIcon value='add-circle' size='16' />
            </AtButton>
          }
        </View>
      </View>
    </View>
  )
}

MPInputDynamicItemTime.defaultProps = {
  time: undefined,
}

export default MPInputDynamicItemTime
