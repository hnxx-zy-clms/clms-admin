import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const Name = 'name'
const UserId = 'userid'

export function getToken() {
  return Cookies.get(TokenKey)
}
export function getName() {
  return Cookies.get(Name)
}

export function setName(name) {
  return Cookies.set(Name, name)
}

export function setUserId(id) {
  return Cookies.set(UserId, id)
}

export function getUserId() {
  return Cookies.get(UserId)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
