import Taro from '@tarojs/taro'

import { HOST } from '../constants'

/**
 * Get token to send requests those require authorization.
 * @param {*} success requires `token` as param
 * @param {*} fail optional
 */
export const getToken = ({ success, fail }) => {
  const token = Taro.getStorageSync('token')
  if (token) {
    Taro.checkSession({
      success: () => {
        success(token)
      },
      fail: () => {
        // session key invalid
        console.log('session key invalid')
        login({ success, fail })
      }
    })
  } else {
    console.log('no session key yet')
    login({ success, fail })
  }
}


const login = ({ success, fail }) => {
  Taro.login({
    success: res => {
      const code = res.code
      Taro.request({
        url: `${HOST}/users`,
        method: 'POST',
        data: code,
        success: res => {
          console.log(res)
          if (res.statusCode >= 400) {
            Taro.showToast({
              title: '登录失败',
              icon: 'none'
            })
            fail()
          } else {
            const token = res.data.data
            Taro.setStorageSync('token', token)
            success(token)
          }
        },
        fail: err => {
          if (fail) {
            fail(err)
          } else {
            console.error(err)
          }
        }
      })
    },
    fail: err => {
      if (fail) {
        fail(err)
      } else {
        console.error(err)
      }
    }
  })
}


