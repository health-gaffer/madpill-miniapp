import {Component} from '@tarojs/taro';
import {View} from '@tarojs/components';
import MedicineItem from './MedicineItem';
import './index.scss';

export default class MedicineList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      medicines : {
        expired: [],
        expiring: [],
        notExpired: []
      }
    };
  }

  componentDidMount() {
    // todo 通过 token 获取数据
    const medicines = {
      expired: [
        // 已过期
        {
          id: 1,
          name: '奥硝唑片',
          manufacture: '潇然',
          day: '10',
          tags: [
            {
              id: 1,
              name: '牙疼',
              userId: null
            },
            {
              id: 2,
              name: '抗寄生虫',
              userId: null
            },
            {
              id: 3,
              name: '止痛',
              userId: null
            }
          ]
        }
      ],
      expiring: [
        {
          id: 2,
          name: '奥硝唑片',
          manufacture: '潇然',
          day: '20',
          tags: [
            {
              id: 4,
              name: '牙疼',
              userId: null
            },
            {
              id: 5,
              name: '抗寄生虫',
              userId: null
            },
            {
              id: 6,
              name: '止痛',
              userId: null
            }
          ]
        }
      ],
      notExpired: [
        {
          id: 3,
          name: '很长很长的很长很长很长的药名',
          manufacture: '很长很长很长很长的厂商名',
          tags: [
            {
              id: 7,
              name: '很长很长的 tag',
              userId: null
            },
            {
              id: 8,
              name: '很长很长的 tag',
              userId: null
            },
            {
              id: 9,
              name: '很长很长很长的 tag',
              userId: null
            },
            {
              id: 10,
              name: '很长很长很长的 tag',
              userId: null
            }
          ]
        },
        {
          id: 4,
          name: '两个标签',
          manufacture: '很长很长很长很长的厂商名',
          tags: [
            {
              id: 9,
              name: 'tag 1',
              userId: null
            },
            {
              id: 10,
              name: 'tag 2',
              userId: null
            }
          ]
        }
      ]
    };
    this.setState({medicines: medicines});
  }

  // 删除药品
  handleDelete(drugId) {
    console.log('被删除药品 id 为' + drugId);
    const expired = this.state.medicines.expired.slice().filter(medicine => medicine.id !== drugId);
    const expiring = this.state.medicines.expiring.slice().filter(medicine => medicine.id !== drugId);
    const notExpired = this.state.medicines.notExpired.slice().filter(medicine => medicine.id !== drugId);
    const medicines = {expired: expired, expiring: expiring, notExpired: notExpired};
    this.setState({medicines: medicines});
    // todo
    // getToken({
    //   success: (token) => {
    //     let requestHeader = {};
    //     requestHeader[HEADER_MADPILL_TOKEN_KEY] = token;
    //     Taro.request({
    //       url: HOST + '/drugs/' + drugId,
    //       method: 'DELETE',
    //       header: requestHeader,
    //       success: result => {
    //         // todo 重新渲染从列表中删除
    //         let medicines = this.state.medicines.slice();
    //         this.setState({medicines: medicines});
    //       },
    //       fail: error => {
    //         console.log('fail');
    //         console.log(error);
    //       }
    //     });
    //   },
    //   fail: (err) => {
    //     console.log(err);
    //   }
    // });
  }

  render() {
    console.log('render');
    const medicines = this.state.medicines;
    console.log(medicines);
    const expiredMedicines = medicines.expired.map(medicine => {
      return (
        <MedicineItem key={String(medicine.id)} medicine={medicine} status='expired'
          onDelete={() => this.handleDelete(medicine.id)}
        />
      );
    });
    const expiringMedicines = medicines.expiring.map(medicine => {
      return (
        <MedicineItem key={String(medicine.id)} medicine={medicine} status='expiring'
          onDelete={() => this.handleDelete(medicine.id)}
        />);
    });
    const notExpiredMedicines = medicines.notExpired.map(medicine => {
      return (
        <MedicineItem key={String(medicine.id)} medicine={medicine} status='notExpired'
          onDelete={() => this.handleDelete(medicine.id)}
        />);
    });
    return (
      <View className='medicine-list'>
        <View className='at-row at-row__align--center desc-wrapper'>
          <View className='at-col desc-text'>已过期</View>
        </View>
        {expiredMedicines}
        <View className='at-row at-row__align--center desc-wrapper'>
          <Text className='at-col desc-text'>即将过期</Text>
        </View>
        {expiringMedicines}
        <View className='at-row at-row__align--center desc-wrapper'>
          <Text className='at-col desc-text'>未过期</Text>
        </View>
        {notExpiredMedicines}
      </View>
    );
  }
}
