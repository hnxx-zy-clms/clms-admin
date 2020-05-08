import request from '@/utils/request'
export function login(data) {
  return request({
    url: `/login?username=${data.username}&password=${data.password}`,
    method: 'post',
    transformResponse: [function(data) {
      return JSON.parse(data)
    }]
  })
}

export function getInfo(params) {
  return request({
    url: '/getUserInfo',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    params
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
