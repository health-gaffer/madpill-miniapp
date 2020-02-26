import Taro, {Component} from '@tarojs/taro'
import {Checkbox, Text, View} from '@tarojs/components'
import {AtSwipeAction} from 'taro-ui'
import './index.scss'
import MPDivider from '../../MPDivider'
import {getPillColor} from '../../../utils'

export default class MedicineItem extends Component {

  static defaultProps = {
    medicine: {
      id: '',
      name: '',
      day: 0,
      manufacture: '',
      tags: []
    }
  }

  // 根据当前状态判断如何操作
  handleItemClick = () => {
    if (this.props.isMultipleSelection) {
      if (this.props.checked) {
        this.props.onRemoveFromList()
      } else {
        this.props.onAddToList()
      }
    } else {
      console.log('查看详情: ' + this.props.medicine.id)
      Taro.navigateTo({
        url: `/pages/medicine/index?action=review&medicineId=${this.props.medicine.id}`
      })
    }
  }

  handleLongPress = () => {
    this.props.onMultipleSelection(this.props.medicine.id)
  }

  renderMedicineInfo() {
    const {medicine, status, isMultipleSelection, checked} = this.props
    const tags = medicine.tags
    // 取前 3 个 items
    const tagItems = tags.slice(0, 3).map(tag => {
      return (
        <View key={tag.id} className='at-col-2 tag'>
          {tag.name}
        </View>
      )
    })
    const ellipses = (tags.length > 3 && <View className='tag tag-ellipse'>···</View>)
    const curPillColor = getPillColor(medicine.manufacture + medicine.name)
    return (
      <View onClick={this.handleItemClick} onLongPress={this.handleLongPress} className='medicine-info'>
        {/*多选模式下，隐藏图片，显示多选框*/}
        <View className='left-part-wrapper'>
          {isMultipleSelection ?
            <Checkbox id={'checkbox-' + medicine.id} value={medicine.id} checked={checked} className='checkbox' />
            :
            <View
              className='madpill icon-pill pill-img'
              style={{color: curPillColor}}
            />
          }
        </View>
        <View className='at-col at-col-9 pill-info-wrapper'>
          <View className='at-row at-row__justify--between at-row__align--center'>
            <Text className='at-col at-col-8 medicine-name'>
              {medicine.name}
            </Text>
            <Text className='at-col at-col-3 manufacture'>
              {medicine.manufacture}
            </Text>
          </View>
          <View className='at-row at-row__justify--between at-row__align--center tags-wrapper'>
            <View className='at-row at-col-8 at-row__justify--start pill-tags-wrapper'>
              {tagItems}
              {ellipses}
            </View>
            {
              {
                'expired':
                  <View className='at-col--auto tag expire-info-tag expired-tag'>
                    过期 {medicine.day} 日
                  </View>,
                'expiring':
                  <View className='at-col--auto tag expire-info-tag expiring-tag'>
                    剩余 {medicine.day} 日
                  </View>,
                'notExpired': ''
              }[status]
            }
          </View>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View className='medicine-item'>
        {/*多选模式下，不允许左滑删除*/}
        {this.props.isMultipleSelection ?
          this.renderMedicineInfo() :
          <AtSwipeAction
            onClick={this.props.onDelete}
            options={[
              {
                text: '删除', style: {backgroundColor: '#FF4949'}
              }]}
          >
            {this.renderMedicineInfo()}
          </AtSwipeAction>
        }
        <MPDivider height='1px' padding='0 16px 0 70px' />
      </View>
    )
  }
}
