import {useEffect, useState,} from '@tarojs/taro'
import {View} from '@tarojs/components'
import MPInputDynamicItemTime from './input-dynamic-item-time'

import './index.scss'
import {getTimeString} from '../../utils'

function MPInputDynamic(props) {

  // 项索引ID、时间数组json、
  const {mpid, value} = props

  const [items, setItems] = useState(value === null ? [] : JSON.parse(value))
  useEffect(() => {
    setItems(value === null ? [] : JSON.parse(value))
  }, [value])

  const addReminder = () => {
    let curItems = JSON.parse(JSON.stringify(items))
    curItems.push(getTimeString(new Date()))
    props.onItemChange(JSON.stringify(curItems), mpid)
  }

  const deleteReminder = (toDeleteIndex) => {
    let curItems = JSON.parse(JSON.stringify(items))
    curItems.splice(toDeleteIndex, 1)
    props.onItemChange(JSON.stringify(curItems), mpid)
  }

  const changeReminder = (toChangeIndex, curTime) => {
    // console.log(`${preTime} => ${curTime}`)
    let curItems = JSON.parse(JSON.stringify(items))
    curItems.splice(toChangeIndex, 1, curTime)
    props.onItemChange(JSON.stringify(curItems), mpid)
  }

  return (
    <View>
      {
        items.length > 0 &&
        items.map((time, index) =>
          <MPInputDynamicItemTime
            className='at-row'
            key={index}
            time={time}
            index={index}
            onDelete={deleteReminder}
            onChange={changeReminder}
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
  value: JSON.stringify([]),
}

export default MPInputDynamic
