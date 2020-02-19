import Taro, {
  useState,
  useEffect,
} from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.scss'
import defaultImage from '../../../assets/images/default_image.png'

function MedicineImage(props) {

  const [curImage, setCurImage] = useState(defaultImage)
  const [width, setWidth] = useState(375)
  const [height, setHeight] = useState(375 / 2)

  useEffect(() => {
    if (props.imageSrc !== '') {
      setCurImage(props.imageSrc)
    }

    setWidthAndHeightBasedOnOriginImage()
  })

  const setWidthAndHeightBasedOnOriginImage =() => {
    console.log(curImage)
    const sysInfo = Taro.getSystemInfoSync()
    Taro.getImageInfo({
      src: curImage,
      success(res) {
        setWidth(sysInfo.windowWidth)
        setHeight(sysInfo.windowWidth / res.width  * res.height)
      }
    })
  }


  const imageClicked = () => {
    // Taro.chooseImage({
    //   count: 1,
    //   sizeType: 'original',
    //   sourceType: ['album', 'camera'],
    //   success(res) {
    //     console.log(res)
    //     if (res.tempFilePaths.length !== 0) {
    //       console.log('select image success')
    //       setCurImage(res.tempFilePaths[0])
    //       setWidthAndHeightBasedOnOriginImage()
    //       // TODO api 上传照片
    //     }
    //   }
    // })

    Taro.showToast({
      title: "定制化图片功能暂未开放，敬请期待（≧∇≦）",
      icon: "none"
    })
  }


  return (
    <View>
      <Image
        onClick={imageClicked}
        className='medicine-photo'
        src={curImage}
        style={{width: `${width}px`, height: `${height}px`}}
      />
    </View>
  )
}

MedicineImage.defaultProps ={
  imageSrc: ''
}

export default MedicineImage
