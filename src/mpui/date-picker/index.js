import {useEffect, useState} from '@tarojs/taro'
import {Picker, View} from '@tarojs/components'

import './index.scss'

function MPDatePicker(props) {

  // 项索引ID、提示信息、
  const {mpid} = props

  // 因为通过 props.onItemChange 父组件只更新了部分属性而不是整个对象，所以比较时父组件的传递 data 与子组件中的 props 是一个对象，故需要自己维护状态
  const [value, setValue] = useState(props.value)

  // 父组件中数据加载变动
  useEffect(() => {
    // console.log(`${mpid}'s props value changed`)
    setValue(props.value)
  }, [props.value])

  const handleChange = (e) => {
    // console.log(e)
    setValue(e.target.value)
    props.onItemChange(e.target.value, mpid)
    return e.target.value
  }

  return (
    <View className='at-row'>
      <View className='at-col-10'>
        <Picker
          mode='date'
          value={value}
          onChange={handleChange}
        >
          <View className='picker'>
            {value}
          </View>
        </Picker>
      </View>
    </View>
  )
}

MPDatePicker.defaultProps = {
  mpid: '',
  value: '',
}

export default MPDatePicker
