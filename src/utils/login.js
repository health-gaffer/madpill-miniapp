import Taro from "@tarojs/taro"

import { LOGIN_STORAGE_KEY } from '../constants'

/**
 * Get login code to send requests those require authorization.
 * @param {*} onResult requires `code` as param
 * @param {*} onError optional
 * @param {*} onComplete optional
 */
export const login = ({ success, fail, complete }) => {
  Taro.login({
    success: res => {
      const code = res.code
      if (success) {
        success(code)
      } else {
        console.log(code)
      }
    },
    fail: err => {
      if (fail) {
        fail(err)
      } else {
        console.error(err)
      }
    },
    complete: () => {
      if (complete) {
        complete()
      }
    }
  })
}
