import Taro, {Component} from '@tarojs/taro'
import {Image, Text, View} from '@tarojs/components'
import {AtActivityIndicator} from 'taro-ui'
import MedicineItem from './MedicineItem'
import './index.scss'
import {getToken} from '../../utils/login'
import {HEADER_MADPILL_TOKEN_KEY} from '../../constants'
import boxIcon from '../../assets/icons/box.png'

export default class MedicineList extends Component {

  static defaultProps = {
    keyword: ''
  }

  constructor(props) {
    super(props)
    this.state = {
      medicines: {
        expired: [],
        expiring: [],
        notExpired: []
      },
      isLoading: false,
      isMultipleSelection: false,
      // 多选列表
      selectedIds: [],
      // todo 获取用户群组
      groups: ['group1', 'group2']
    }
  }

  componentDidMount() {
    this.props.onRef(this)
    this.setState({
      isLoading: true
    })
    this.updateList()
  }

  updateList = (groupId) => {
    this.setState({
      isLoading: true
    })
    getToken({
      success: (token) => {
        let requestHeader = {}
        requestHeader[HEADER_MADPILL_TOKEN_KEY] = token
        Taro.request({
          url: HOST + '/drugs?group=' + groupId,
          method: 'GET',
          header: requestHeader,
          success: res => {
            if (res.data.data != null) {
              this.setState({
                medicines: res.data.data
              })
            }
            this.setState({
              isLoading: false
            })
          },
          fail: error => {
            console.log('fail')
            console.log(error)
          }
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  }

  // 长按列表项，激活多选
  handleMultipleSelection = (firstId) => {
    if (!this.state.isMultipleSelection) {
      console.log('激活多选，选择的 id 是: ' + firstId)
      this.state.selectedIds.push(firstId)
      this.setState({
        isMultipleSelection: true,
        selectedIds: this.state.selectedIds
      })
    }
  }

  // 判断是否为选中状态
  isChecked = (id) => {
    if (this.state.isMultipleSelection) {
      return this.state.selectedIds.some((selectedId) => {
        return selectedId === id
      })
    }
    return false
  }

  // add items
  addMedicineItem = (id) => {
    this.state.selectedIds.push(id)
    this.setState({
      selectedIds: this.state.selectedIds
    })
  }

  removeMedicineItem = (id) => {
    let index = this.state.selectedIds.indexOf(id)
    if (index !== -1) {
      this.state.selectedIds.splice(index, 1)
      this.setState({
        selectedIds: this.state.selectedIds
      })
    } else {
      console.error('药品 ' + id + '不在选中列表中')
    }
  }

  deleteSelected = () => {
    // todo
    console.log('要删除的药品列表为: ' + this.state.selectedIds)
  }

  handleGroupChange = e => {
    // todo 更改分组
    console.log('更改后的分组为: ' + this.state.groups[e.detail.value])
  }

  cancelMultiSelection = () => {
    this.setState({
      isMultipleSelection: false,
      selectedIds: []
    })
  }

  // 删除药品
  handleDelete(drugId) {
    console.log('被删除药品 id 为' + drugId)
    getToken({
      success: (token) => {
        let requestHeader = {}
        requestHeader[HEADER_MADPILL_TOKEN_KEY] = token
        Taro.request({
          url: HOST + '/drugs/' + drugId,
          method: 'DELETE',
          header: requestHeader,
          success: () => {
            const expired = this.state.medicines.expired.slice().filter(medicine => medicine.id !== drugId)
            const expiring = this.state.medicines.expiring.slice().filter(medicine => medicine.id !== drugId)
            const notExpired = this.state.medicines.notExpired.slice().filter(medicine => medicine.id !== drugId)
            const medicines = {expired: expired, expiring: expiring, notExpired: notExpired}
            this.setState({medicines: medicines})
          },
          fail: error => {
            console.log('fail')
            console.log(error)
          }
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  }

  render() {
    if (this.state.isMultipleSelection) {
      console.log('当前选中的药品列表为: ' + this.state.selectedIds)
    }
    const keyword = this.props.keyword.trim()
    console.log(keyword)
    let selectedMedicines = Object.assign({}, this.state.medicines)
    console.log(selectedMedicines)
    let filteredMedicines = Object.assign({}, this.state.medicines)
    if (typeof (keyword) !== undefined && keyword !== '') {
      Object.keys(selectedMedicines).forEach(function (key) {
        filteredMedicines[key] = selectedMedicines[key].filter(m => m.name.indexOf(keyword) >= 0 || m.tags.some(tag => tag.name.indexOf(keyword) >= 0))
      })
    }
    const expiredMedicines = filteredMedicines.expired.map(medicine => {
      return (
        <MedicineItem
          key={String(medicine.id)}
          medicine={medicine} status='expired'
          isMultipleSelection={this.state.isMultipleSelection}
          checked={this.isChecked(medicine.id)}
          onMultipleSelection={() => this.handleMultipleSelection(medicine.id)}
          onAddToList={() => this.addMedicineItem(medicine.id)}
          onRemoveFromList={() => this.removeMedicineItem(medicine.id)}
          onDelete={() => this.handleDelete(medicine.id)}
        />
      )
    })
    const expiringMedicines = filteredMedicines.expiring.map(medicine => {
      return (
        <MedicineItem
          key={String(medicine.id)}
          medicine={medicine} status='expiring'
          isMultipleSelection={this.state.isMultipleSelection}
          checked={this.isChecked(medicine.id)}
          onMultipleSelection={() => this.handleMultipleSelection(medicine.id)}
          onAddToList={() => this.addMedicineItem(medicine.id)}
          onRemoveFromList={() => this.removeMedicineItem(medicine.id)}
          onDelete={() => this.handleDelete(medicine.id)}
        />
      )
    })
    const notExpiredMedicines = filteredMedicines.notExpired.map(medicine => {
      return (
        <MedicineItem
          key={String(medicine.id)}
          medicine={medicine} status='notExpired'
          isMultipleSelection={this.state.isMultipleSelection}
          checked={this.isChecked(medicine.id)}
          onMultipleSelection={() => this.handleMultipleSelection(medicine.id)}
          onAddToList={() => this.addMedicineItem(medicine.id)}
          onRemoveFromList={() => this.removeMedicineItem(medicine.id)}
          onDelete={() => this.handleDelete(medicine.id)}
        />
      )
    })
    const hasMedicine = (this.state.medicines == null || typeof (this.state.medicines) == 'undefined' || this.state.medicines === 0
      || (this.state.medicines['expired'].length === 0 && this.state.medicines['expiring'].length === 0 && this.state.medicines['notExpired'].length === 0))
    return (
      <View className='medicine-list-wrapper'>
        <View className='list-info'>
          {this.state.isLoading ?
            <View className='loading'>
              <AtActivityIndicator content='加载中...' size={50} />
            </View> :
            hasMedicine ?
              <View className='empty-panel'>
                <View className='inner-panel'>
                  <Image
                    className='box-icon'
                    src={boxIcon}
                    mode='aspectFit'
                  />
                </View>
                <View className='inner-panel'>
                  <View>~添加一个药品吧~</View>
                </View>
              </View> :
              <View>
                <View className='at-row at-row__align--center desc-wrapper'>
                  {selectedMedicines.expired.length > 0 && <Text className='at-col desc-text'>已过期</Text>}
                </View>
                {expiredMedicines}
                <View className='at-row at-row__align--center desc-wrapper'>
                  {selectedMedicines.expiring.length > 0 && <Text className='at-col desc-text'>即将过期</Text>}
                </View>
                {expiringMedicines}
                <View className='at-row at-row__align--center desc-wrapper'>
                  {selectedMedicines.notExpired.length > 0 && <Text className='at-col desc-text'>未过期</Text>}
                </View>
                {notExpiredMedicines}
              </View>
          }
        </View>
        {
          this.state.isMultipleSelection &&
          <View className='option-box'>
            <View className='delete-btn-wrapper' onClick={this.deleteSelected}>
              <View className='delete-btn'>
                删除所选
              </View>
            </View>
            <View className='group-picker-wrapper'>
              <Picker mode='selector' range={this.state.groups} onChange={this.handleGroupChange}>
                <View className='picker'>
                  移动至
                </View>
              </Picker>
            </View>
            <View className='cancel-btn-wrapper' onClick={this.cancelMultiSelection}>
              <View className='cancel-btn'>
                取消
              </View>
            </View>
          </View>
        }
      </View>
    )
  }
}
