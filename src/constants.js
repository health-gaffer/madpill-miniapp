export const HOST = 'https://tokindle.top/madpill'
export const HEADER_MADPILL_TOKEN_KEY = 'madpill-token'

export const MADPILL_COLORS = [
  '#323b5e',
  '#f8b54e',
  '#aabbcc',
  '#f8124e',
  '#f13d73',
  '#5593b8',
  '#3fd4dc',
  '#3fd49c',
]

/**
 * add => medicine 路由参数规则
 * action: 'add' (新增)
 *        addMode: 'madpill' (选取已有的药品)
 *                warehouseId: $warehouseId (仓库药名ID)
 *        addMode: 'direct' (直接输入)
 *                manualName: $manualName (药品名称)
 * action: 'review' (查看)
 *        medicineId: $id (药品ID)
 */
export const MADPILL_ADD_CONFIG = {
  ACTION_ADD: 'add',
  ACTION_REVIEW: 'review',

  ADD_MODE_MADPILL: 'madpill',
  ADD_MODE_DIRECT: 'direct',
}

export const MADPILL_RESPONSE_CODE ={
  OK: 200,

}
export const LOGIN_STORAGE_KEY = "code"

