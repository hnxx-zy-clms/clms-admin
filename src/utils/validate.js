/**
 * Created by PanJiaChen on 16/11/18.
 * 验证规则
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin']
  return valid_map.indexOf(str.trim()) >= 0
}
