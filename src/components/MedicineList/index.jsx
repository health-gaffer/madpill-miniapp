import Taro, {Component} from '@tarojs/taro'
import {Image, Picker, Text, View} from '@tarojs/components'
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
      // 多选列表
      selectedIds: []
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
    if(typeof(groupId) !== 'undefined') {
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
  }

  // 长按列表项，激活多选
  handleMultipleSelection = (firstId) => {
    if (!this.props.inMultipleSelection) {
      console.log('激活多选，选择的 id 是: ' + firstId)
      this.state.selectedIds.push(firstId)
      this.setState({
        selectedIds: this.state.selectedIds
      })
      this.props.onSelectionModeChange(true)
    }
  }

  // 判断是否为选中状态
  isChecked = (id) => {
    if (this.props.inMultipleSelection) {
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

  handleDeleteClick = () => {
    Taro.showModal({
      title: '提示',
      content: '确定删除所选药品吗？',
      // confirmText: '删除',
      // confirmColor: '#333',
      success: res => {
        if (res.confirm) {
          console.log('delete confirmed')
          this.confirmDelete()
        }
      }
    })
  }

  confirmDelete = () => {
    console.log('要删除的药品列表为: ' + this.state.selectedIds)
    getToken({
      success: (token) => {
        let requestHeader = {}
        requestHeader[HEADER_MADPILL_TOKEN_KEY] = token
        Taro.request({
          url: HOST + '/drugs',
          method: 'DELETE',
          header: requestHeader,
          data: JSON.stringify(this.state.selectedIds),
          success: () => {
            Taro.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 1000
            }).then(res => {
              console.log(res)
              this.setState({
                selectedIds: []
              })
              this.props.onSelectionModeChange(false)
              this.updateList(this.props.curGroup.id)
            })
          },
          fail: error => {
            Taro.showToast({
              title: '删除失败',
              icon: 'none',
              duration: 1000
            }).then(res => {
              console.log(res)
            })
            console.log(error)
          }
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  }

  handleGroupChange = e => {
    if (this.props.curGroup.id !== this.props.groupList[e.detail.value].id) {
      console.log('更改后的分组为: ' + this.props.groupList[e.detail.value].name)
      Taro.showModal({
        title: '提示',
        content: '确定移动所选药品吗？',
        // confirmText: '删除',
        // confirmColor: '#333',
        success: res => {
          if (res.confirm) {
            console.log('group change confirmed')
            this.confirmGroupChange(this.props.groupList[e.detail.value].id)
          }
        }
      })
    }
  }

  confirmGroupChange = (destGroupId) => {
    getToken({
      success: (token) => {
        let requestHeader = {}
        requestHeader[HEADER_MADPILL_TOKEN_KEY] = token
        Taro.request({
          url: HOST + '/drugs?destGroup=' + destGroupId,
          method: 'PUT',
          header: requestHeader,
          data: JSON.stringify(this.state.selectedIds),
          success: () => {
            Taro.showToast({
              title: '移动成功',
              icon: 'success',
              duration: 1000
            }).then(res => {
              console.log(res)
              this.setState({
                selectedIds: []
              })
              this.props.onSelectionModeChange(false)
              this.updateList(this.props.curGroup.id)
            })
          },
          fail: error => {
            Taro.showToast({
              title: '移动失败',
              icon: 'none',
              duration: 1000
            }).then(res => {
              console.log(res)
            })
            console.log(error)
          }
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  }

  clearSelectedIds = () => {
    this.setState({
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
            this.updateList(this.props.curGroup.id)
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
    if (this.props.inMultipleSelection) {
      console.log('当前选中的药品列表为: ' + this.state.selectedIds)
    }
    const keyword = this.props.keyword.trim()
    // console.log(keyword)
    let selectedMedicines = Object.assign({}, this.state.medicines)
    // console.log(selectedMedicines)
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
          isMultipleSelection={this.props.inMultipleSelection}
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
          isMultipleSelection={this.props.inMultipleSelection}
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
          isMultipleSelection={this.props.inMultipleSelection}
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
              <AtActivityIndicator content='加载中...' size={50}/>
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
          this.props.inMultipleSelection &&
          <View className='option-box'>
            <View className='delete-btn-wrapper'>
              <View className='delete-btn' onClick={this.handleDeleteClick}>
                删除
              </View>
            </View>
            <View className='group-picker-wrapper'>
              <Picker mode='selector' range={this.props.groupList} rangeKey='name' onChange={this.handleGroupChange}>
                <View className='picker'>
                  移动
                </View>
              </Picker>
            </View>
          </View>
        }
      </View>
    )
  }
}
