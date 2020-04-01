import request from '@/utils/request'

export function login(data) {
  return request({
    // url: `/login?username=${data.username}&password=${data.password}`,
    url: `/login?username=admin&password=111111`,
    method: 'post',
    transformResponse: [function(data) {
      return JSON.parse(data)
    }]
  })
}

export function getInfo() {
  return request({
    url: '/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
