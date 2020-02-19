import {View} from '@tarojs/components';
import {AtDivider} from 'taro-ui';

function MPDivider(props) {

  const {height = '40', padding = '0px', type = 'light-gray'} = props;
  return (
    <View style={{padding: padding}}>
      <View className='at-row'>
        {
          type === 'light-gray' &&
          <AtDivider height={height} lineColor='#e6e6e6' />
        }

        {
          type === 'dark-gray' &&
          <AtDivider height={height} lineColor='#737373' />
        }
      </View>
    </View>
  );
}

export default MPDivider;
