import Taro, {Component} from '@tarojs/taro';
import {View} from '@tarojs/components';
import MedicineItem from './MedicineItem';
import './index.scss';
import {getToken} from '../../utils/login';
import {HEADER_MADPILL_TOKEN_KEY, HOST} from '../../constants';

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
      }
    };
  }

  componentDidMount() {
    getToken({
      success: (token) => {
        let requestHeader = {};
        requestHeader[HEADER_MADPILL_TOKEN_KEY] = token;
        Taro.request({
          url: HOST + '/drugs',
          method: 'GET',
          header: requestHeader,
          success: res => {
            this.setState({
              medicines: res.data.data
            });
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
    // for test
    // const medicines = {
    //   expired: [
    //     // 已过期
    //     {
    //       id: 100000005,
    //       name: '奥硝唑片',
    //       manufacture: '潇然',
    //       day: '10',
    //       tags: [
    //         {
    //           id: 1,
    //           name: '牙疼',
    //           userId: null
    //         },
    //         {
    //           id: 2,
    //           name: '抗寄生虫',
    //           userId: null
    //         },
    //         {
    //           id: 3,
    //           name: '止痛',
    //           userId: null
    //         }
    //       ]
    //     }
    //   ],
    //   expiring: [
    //     {
    //       id: 100000006,
    //       name: '奥硝唑片',
    //       manufacture: '潇然',
    //       day: '20',
    //       tags: [
    //         {
    //           id: 4,
    //           name: '牙疼',
    //           userId: null
    //         },
    //         {
    //           id: 5,
    //           name: '抗寄生虫',
    //           userId: null
    //         },
    //         {
    //           id: 6,
    //           name: '止痛',
    //           userId: null
    //         }
    //       ]
    //     }
    //   ],
    //   notExpired: [
    //     {
    //       id: 105,
    //       name: '很长很长的很长很长很长的药名',
    //       manufacture: '很长很长很长很长的厂商名',
    //       tags: [
    //         {
    //           id: 7,
    //           name: '很长很长的 tag',
    //           userId: null
    //         },
    //         {
    //           id: 8,
    //           name: '很长很长的 tag',
    //           userId: null
    //         },
    //         {
    //           id: 9,
    //           name: '很长很长很长的 tag',
    //           userId: null
    //         },
    //         {
    //           id: 10,
    //           name: '很长很长很长的 tag',
    //           userId: null
    //         }
    //       ]
    //     },
    //     {
    //       id: 106,
    //       name: '两个标签',
    //       manufacture: '很长很长很长很长的厂商名',
    //       tags: [
    //         {
    //           id: 9,
    //           name: 'tag 1',
    //           userId: null
    //         },
    //         {
    //           id: 10,
    //           name: 'tag 2',
    //           userId: null
    //         }
    //       ]
    //     }
    //   ]
    // };
    // this.setState({medicines: medicines});
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
    );
  }
}
