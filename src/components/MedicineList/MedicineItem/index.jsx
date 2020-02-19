import {Component} from '@tarojs/taro';
import {Text, View} from '@tarojs/components';
import {AtSwipeAction} from 'taro-ui';
import './index.scss';
import MPDivider from '../../MPDivider';
import defaultPill from '../../../assets/images/pill-5.png';

export default class MedicineItem extends Component {

  render() {
    const tags = this.props.medicine.tags;
    // 取前 3 个 items
    const tagItems = tags.slice(0, 3).map(tag => {
      return (
        <View key={tag.id} className='at-col at-col-3 tag'>
          {tag.name}
        </View>
      );
    });
    const ellipses = (tags.length > 3 && <Text>...</Text>);
    return (
      <View className='medicine-item'>
        <AtSwipeAction
          onClick={this.props.onDelete}
          options={[
            {
              text: '删除', style: {backgroundColor: '#FF4949'}
            }]}
        >
          <View className='at-row medicine-info'>
            <View className='at-col at-col-1 at-col--auto pill-img-wrapper'>
              <Image src={defaultPill} className='pill-img' />
            </View>
            <View className='at-col at-col-9 pill-info-wrapper'>
              <View className='at-row at-row__justify--between at-row__align--center'>
                <Text className='at-col at-col-5 medicine-name'>
                  {this.props.medicine.name}
                </Text>
                <Text className='at-col at-col-3 manufacture'>
                  {this.props.medicine.manufacture}
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
                        过期 {this.props.medicine.day} 日
                      </View>,
                    'expiring':
                      <View className='at-col--auto tag expire-info-tag expiring-tag'>
                        剩余 {this.props.medicine.day} 日
                      </View>,
                    'notExpired': ''
                  }[this.props.status]
                }
              </View>
            </View>
          </View>
        </AtSwipeAction>
        <MPDivider height='1px' padding='0 16px 0 70px' />
      </View>
    );
  }
}
