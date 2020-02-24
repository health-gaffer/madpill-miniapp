import {Input, View} from '@tarojs/components'

import './index.scss'

function MPInput(props) {

  // 项索引ID、提示信息、
  const {mpid, value, placeholder} = props

  const handleChange = (e) => {
    // console.log(e)
    props.onItemChange(e.target.value, mpid)
    return e.target.value
  }

  return (
    <View className='at-row'>
      <View className='at-col-10'>
        <Input
          type='text'
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
        />
      </View>
    </View>
  )
}

MPInput.defaultProps = {
  mpid: '',
  value: '',
  placeholder: '',
}

export default MPInput
