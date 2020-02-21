import Taro, {Component} from '@tarojs/taro';
import {View, Image, Text} from '@tarojs/components';
import MedicineItem from './MedicineItem';
import './index.scss';
import {getToken} from '../../utils/login';
import {HEADER_MADPILL_TOKEN_KEY} from '../../constants';
import {AtActivityIndicator} from 'taro-ui'
import boxIcon from '../../assets/icons/box.png';

export default class MedicineList extends Component {

  static defaultProps = {
    keyword: ''
  }

  constructor(props) {
    super(props);
    this.state = {
      medicines: {
        expired: [],
        expiring: [],
        notExpired: []
      },
      isLoading: false
    };
  }


  componentDidMount() {
    this.props.onRef(this)
    this.setState({
      isLoading: true
    })
    this.updateList()
  }

  updateList = () => {
    getToken({
      success: (token) => {
        let requestHeader = {};
        requestHeader[HEADER_MADPILL_TOKEN_KEY] = token;
        Taro.request({
          url: HOST + '/drugs',
          method: 'GET',
          header: requestHeader,
          success: res => {
            if (res.data.data != null) {
              this.setState({
                medicines: res.data.data
              });
            }
            this.setState({
              isLoading: false
            })
          },
          fail: error => {
            console.log('fail');
            console.log(error);
          }
        });
      },
      fail: (err) => {
        console.log(err);
      }
    });
  }

  // 删除药品
  handleDelete(drugId) {
    console.log('被删除药品 id 为' + drugId);
    // for test
    // const expired = this.state.medicines.expired.filter(medicine => medicine.id !== drugId);
    // const expiring = this.state.medicines.expiring.filter(medicine => medicine.id !== drugId);
    // const notExpired = this.state.medicines.notExpired.filter(medicine => medicine.id !== drugId);
    // const medicines = {expired: expired, expiring: expiring, notExpired: notExpired};
    // this.setState({medicines: medicines});

    // connect server

    getToken({
      success: (token) => {
        let requestHeader = {};
        requestHeader[HEADER_MADPILL_TOKEN_KEY] = token;
        Taro.request({
          url: HOST + '/drugs/' + drugId,
          method: 'DELETE',
          header: requestHeader,
          success: () => {
            const expired = this.state.medicines.expired.slice().filter(medicine => medicine.id !== drugId);
            const expiring = this.state.medicines.expiring.slice().filter(medicine => medicine.id !== drugId);
            const notExpired = this.state.medicines.notExpired.slice().filter(medicine => medicine.id !== drugId);
            const medicines = {expired: expired, expiring: expiring, notExpired: notExpired};
            this.setState({medicines: medicines});
          },
          fail: error => {
            console.log('fail');
            console.log(error);
          }
        });
      },
      fail: (err) => {
        console.log(err);
      }
    });
  }

  render() {
    const keyword = this.props.keyword.trim();
    console.log(keyword)
    let selectedMedicines = Object.assign({}, this.state.medicines);
    console.log(selectedMedicines)
    if (keyword !== '') {
      selectedMedicines['expired'] = selectedMedicines.expired.filter(m => m.name.indexOf(keyword) >= 0 || m.tags.some(tag => tag.name.indexOf(keyword) >= 0))
      selectedMedicines['expiring'] = selectedMedicines.expiring.filter(m => m.name.indexOf(keyword) >= 0 || m.tags.some(tag => tag.name.indexOf(keyword) >= 0))
      selectedMedicines['notExpired'] = selectedMedicines.notExpired.filter(m => m.name.indexOf(keyword) >= 0 || m.tags.some(tag => tag.name.indexOf(keyword) >= 0))
    }
    const expiredMedicines = selectedMedicines.expired.map(medicine => {
      return (
        <MedicineItem key={String(medicine.id)} medicine={medicine} status='expired'
                      onDelete={() => this.handleDelete(medicine.id)}
        />
      );
    });
    const expiringMedicines = selectedMedicines.expiring.map(medicine => {
      return (
        <MedicineItem key={String(medicine.id)} medicine={medicine} status='expiring'
                      onDelete={() => this.handleDelete(medicine.id)}
        />);
    });
    const notExpiredMedicines = selectedMedicines.notExpired.map(medicine => {
      return (
        <MedicineItem key={String(medicine.id)} medicine={medicine} status='notExpired'
                      onDelete={() => this.handleDelete(medicine.id)}
        />);
    });
    return (
      <View className='medicine-list'>
        {this.state.isLoading ?
          <View className='loading'>
            <AtActivityIndicator content='加载中...' size={50}></AtActivityIndicator>
          </View> :
          this.state.medicine == null ?
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
    );
  }
}
