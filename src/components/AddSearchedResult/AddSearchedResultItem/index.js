import Taro, {
  useState,
  useEffect,
} from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'
import { getPillColor } from "../../../utils"

function AddSearchedResultItem(props) {

  const {name, manufacture} = props.item

  const [color, setColor] = useState('white')

  useEffect(() => {
    setColor(getPillColor(manufacture + name))
  })

  return (
    <View className='result-item at-row at-row__align--center'>
      <View className='pill-photo at-col-1'>
        <View className='madpill icon-pill' style={{color: color}} />
      </View>

      <View className='name at-col-9'>
        {name}
      </View>

      <View className='manufacture at-col-2'>
        <View className='at-row at-row__justify--end'>
          {manufacture}
        </View>
      </View>
    </View>
  )
}

AddSearchedResultItem.defaultProps = {
  item: {}
}

export default AddSearchedResultItem
