import Taro, {useEffect, useState} from '@tarojs/taro'
import {View} from '@tarojs/components'
import MPInputDynamicItemTime from './input-dynamic-item-time'

import './index.scss'
import {getTimeString} from '../../utils'

function MPInputDynamic(props) {
  //
  // // 项索引ID、
  // const {mpid} = props
  //
  // // 因为通过 props.onItemChange 父组件只更新了部分属性而不是整个对象，所以比较时父组件的传递 data 与子组件中的 props 是一个对象，故需要自己维护状态
  // const [value, setValue] = useState(props.value)
  //
  // // 父组件中数据加载变动
  // useEffect(() => {
  //   // console.log(`${mpid}'s props value changed`)
  //   setValue(props.value)
  // }, [props.value])
  //
  // const handleChange = (e) => {
  //   // console.log(e)
  //   setValue(e.target.value)
  //   props.onItemChange(e.target.value, mpid)
  //   return e.target.value
  // }

  const [value, setValue] = useState([
    '20:20', '13:23'
  ])

  const addReminder = () => {
    setValue(prevReminders => {
      prevReminders.push(getTimeString(new Date()))
      return prevReminders
    })
  }

  const deleteReminder = (toDeleteTime) => {
    setValue(prevReminders => {
      const toDeleteIndex = prevReminders.indexOf(toDeleteTime)
      prevReminders.splice(toDeleteIndex, 1)
      return prevReminders
    })
  }

  return (
    <View>
      {
        value.length > 0 &&
        value.map(time =>
          <MPInputDynamicItemTime
            className='at-row'
            key={time}
            time={time}
            onDelete={deleteReminder}
          />
        )
      }

      {/* 新增提醒 */}
      <MPInputDynamicItemTime className='at-row' onAdd={addReminder} />
    </View>
  )
}

MPInputDynamic.defaultProps = {
  mpid: '',
  value: [],
}

export default MPInputDynamic
