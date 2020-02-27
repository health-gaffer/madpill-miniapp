import {Input, View} from '@tarojs/components'

import './index.scss'

function MPSearchBar(props) {

  const {keyword, placeholder} = props

  // 搜索框内容改变
  const handleSearch = (e) =>  {
    props.onChange(e.detail.value)
  };

  return (
    <View className='search-area'>
      <Input
        className='search-input'
        value={keyword}
        placeholder={placeholder}
        onInput={handleSearch}
      />
    </View>
  );
}

MPSearchBar.defaultProps = {
  keyword: '',
  placeholder: '',
}

export default MPSearchBar;
