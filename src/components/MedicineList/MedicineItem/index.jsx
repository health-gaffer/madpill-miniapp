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

  constructor(props) {
    super(props);
    this.state = {
      showMore : false
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

  showMore = (e) => {
    e.stopPropagation()
    const more = this.state.showMore
    this.setState({
      showMore : !more
    })
  }

  renderMedicineInfo() {
    const {medicine, status, isMultipleSelection, checked} = this.props
    const tags = medicine.tags
    // 取前 3 个 items
    var tag_width = 0.0
    var needArrow = false
    var needArc = false
    var cancel_arc = false
    tags.map(tag => {
      tag_width += 1.6 + tag.name.length;
      if(tag_width < 14.42 && tag_width > 14.35 ) {
        cancel_arc = true
      }
    })
    if(tag_width > 14.42){
      needArc= !cancel_arc
      // if(!needArc){
        needArrow = true
      // }
    }

    console.log(needArrow)
    const tagItems = tags.map(tag => {
      tag_width += 1.6 + tag.name.length;
      // if(!this.state.needArrow && tag_width > 14.35 ) {
      //
      // }
      // this.state({
      //   needArc : false,
      //   needArrow: false
      // })
      // console.log(tag_width)
      return (
        <View key={tag.id} className='tag'>
          {tag.name}
        </View>
      )
    })
    // console.log(tag_width)
    // 163 12.8  12.7 14.4
    // 150 11.8  12.7 188/

    // const ellipses = (tags.length > 6 && <View className='tag tag-ellipse'>···</View>)
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
          <View className='at-row '>
            <Text className='at-col at-col-8 medicine-name'>
              {medicine.name}
            </Text>
            <Text className='at-col at-col-3 manufacture'>
              {medicine.manufacture}
            </Text>
          </View>
          <View className='at-row  tags-wrapper'>
            <View className='at-col-8' onClick={this.showMore}>
              <View className={this.state.showMore?'pill-tags-wrapper wrapper':'pill-tags-wrapper'}>
                {tagItems}
              </View>
            </View>
            {!this.state.showMore &&
            <View className=''>
              <View className='pill-tags-wrapper'>
                {needArc &&
                <View className='tag extra-tag'>
                  1
                </View>
                }
                {needArrow &&
                (needArc ? <View className="more no-space"/> : <View className="more"/>)
                }
              </View>
            </View>
            }
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
