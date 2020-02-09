import Taro from "@tarojs/taro";

import { HOST } from "./constants";

// eslint-disable-next-line import/prefer-default-export
export const fetchAuthorizationInfo = callback => {
  Taro.login({
    success: res => {
      Taro.request({
        url: `${HOST}/token?code=${res.code}`,
        success: res2 => {
          if (res2.statusCode >= 400 || !res2.data.data) {
            Taro.showToast({
              title: '初始化失败',
              icon: 'none'
            });
            return;
          }
          const {token, registered} = res2.data.data;
          callback(token, registered);
        },
        fail: err => {
          console.error(err);
          Taro.showToast({
            title: "网络好像有点问题...",
            icon: "none"
          });
        }
      });
    }
  });
};

export const getDate = (date) => {
  const y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  let d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  return y + '-' + m + '-' + d;
}
