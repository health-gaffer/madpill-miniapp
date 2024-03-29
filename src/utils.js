import Taro from '@tarojs/taro'

import {MADPILL_COLORS} from './constants'

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
            })
            return
          }
          const {token, registered} = res2.data.data
          callback(token, registered)
        },
        fail: err => {
          console.error(err)
          Taro.showToast({
            title: '网络好像有点问题...',
            icon: 'none'
          })
        }
      })
    }
  })
}

export const getDateString = (date) => {
  const y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? ('0' + m) : m
  let d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  return y + '-' + m + '-' + d
}

export const getTimeString = (date) => {
  const hour = date.getHours()
  let minute = date.getMinutes()
  minute = minute < 10 ? ('0' + minute) : minute
  return hour + ':' + minute
}

/**
 * @param {Date} cur
 * @return {Date}
 */
export const getTodayOfLastYear = (cur) => {
  const date = new Date(cur)
  date.setFullYear(date.getFullYear() - 1)
  return date
}

/**
 * @param {string} name: the name of pill
 */
export const getPillColor = (name) => {
  let hashCode = stringHashCode(name, false, MADPILL_COLORS.length)
  const MAX_VALUE = Math.pow(2, 32)
  const curIndex = Math.floor(Math.abs(hashCode) / MAX_VALUE * MADPILL_COLORS.length)
  // console.log(Math.abs(hashCode))
  // console.log(curIndex)
  // console.log('---------------')
  return MADPILL_COLORS[curIndex]
}

/**
 * Calculate a 32 bit FNV-1a hash
 * Found here: https://gist.github.com/vaiorabbit/5657561
 * Ref.: http://isthe.com/chongo/tech/comp/fnv/
 *
 * @param {string} str the str value
 * @param {boolean} [asString=false] set to true to return the hash value as
 *     8-digit hex string instead of an integer
 * @param {int} [seed] optionally pass the hash of the previous chunk
 * @returns {int | string}
 */
const stringHashCode = (str, asString, seed) => {
  /*jshint bitwise:false */
  let i, l, hval = (seed === undefined) ? 0x811c9dc5 : seed

  for (i = 0, l = str.length; i < l; i++) {
    hval ^= str.charCodeAt(i)
    hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24)
  }
  if (asString) {
    // Convert to 8 digit hex string
    return ('0000000' + (hval >>> 0).toString(16)).substr(-8)
  }
  return hval >>> 0

  // let hash = 0, i, chr;
  // if (str.length === 0) return hash;
  // for (i = 0; i < str.length; i++) {
  //   chr   = str.charCodeAt(i);
  //   hash  = ((hash << 5) - hash) + chr;
  //   hash |= 0; // Convert to 32bit integer
  // }
  // return hash;
}


/**
 * @param obj
 * @param path
 * @return {undefined|*}
 */
export const getObjValueByPath = (obj, path) => {
  const reg = /(?:(?:^|\.)([^\.\[\]]+))|(?:\[([^\[\]]+)\])/g
  const names = []
  let name = null
  while ((name = reg.exec(path)) != null) {
    names.push(name[1] || name[2])
  }
  let o = obj
  for (let i = 0; i < names.length; i++) {
    o = o[names[i]]
    if (o === undefined) {
      return undefined
    }
  }
  return o
}
