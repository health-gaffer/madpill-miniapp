// 因为覆写的 button 样式 scss 必须在 Page 上。。
// 所以暂时抽不出来组件。。
// 见 https://taro-ui.jd.com/#/docs/customizetheme

// import Taro, {
//   useEffect
// } from '@tarojs/taro'
// import { View } from '@tarojs/components'
// import { AtButton } from "taro-ui"
//
// import './index.scss'
//
// function MPButtons(props) {
//
//   const items = props.items
//
//   useEffect(() => {
//     console.log(items)
//     console.log(typeof items)
//   })
//
//   return (
//     <View className='action at-row at-row__justify--center'>
//       <View className='at-col-8'>
//         {
//           items.map((item, index) => <AtButton className={item.type} key={index}>{item.msg}</AtButton>)
//         }
//       </View>
//     </View>
//   )
// }
//
// MPButtons.defaultProps = {
//   items: []
// }
//
// export default MPButtons
