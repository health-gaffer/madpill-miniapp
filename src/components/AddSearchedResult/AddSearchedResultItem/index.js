import Taro, {
  useState,
  useEffect,
} from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './index.scss'
import { getPillColor } from "../../../utils"

function AddSearchedResultItem(props) {

  const {name, vendor} = props.item

  const [color, setColor] = useState('white')

  useEffect(() => {
    setColor(getPillColor(name))
  })

  const searchItemClicked = (e) => {
  }

  return (
    <View className='result-item at-row at-row__align--center'>
      <View className='pill-photo at-col-1'>
        <Text className='madpill icon-pill2' style={{color: color}} />
      </View>

      <View className='name at-col-9'>
        {name}
      </View>

      <View className='vendor at-col-2'>
        <View className='at-row at-row__justify--end'>
          {vendor}
        </View>
      </View>
    </View>
  )
}

AddSearchedResultItem.defaultProps = {
  item: {}
}

export default AddSearchedResultItem
