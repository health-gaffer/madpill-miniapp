import {Picker, View} from '@tarojs/components'

function MPPicker(props) {

  // 项索引ID、提示信息、
  const {mpid, value, mode} = props

  const handleChange = (e) => {
    // console.log(e)
    props.onItemChange(e.target.value, mpid)
    return e.target.value
  }

  return (
    <View>
      <Picker
        mode={mode}
        value={value}
        onChange={handleChange}
      >
        <View className='picker'>
          {value}
        </View>
      </Picker>
    </View>
  )
}

MPPicker.defaultProps = {
  mpid: '',
  value: '',
  mode: 'date',
}

export default MPPicker
