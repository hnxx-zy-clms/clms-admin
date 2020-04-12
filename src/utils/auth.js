import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const Name = 'name'

export function getToken() {
  return Cookies.get(TokenKey)
}
export function getName() {
  return Cookies.get(Name)
}

export function setName(name) {
  return Cookies.set(Name, name)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
