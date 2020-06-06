import request from '@/utils/request'
var group_name = 'user'
export default {
  getByPage(page) { // 分页查询用户信息
    // 向前端发送查询请求,传递的参数为page(page中封装了三个对象)
    return request({
      url: `/${group_name}/get/byPage`,
      method: 'post',
      data: page
    })
  },
  getByGroup(user) { // 根据用户id和用户名查询用户信息
    return request({
      url: `/${group_name}/get/byGroup`,
      method: 'post',
      data: user
    })
  },
  insertUser(user) { // 添加用户
    return request({
      url: `/${group_name}/add`,
      method: 'post',
      data: user
    })
  },
  updateById(user) { // 添加用户
    return request({
      url: `/${group_name}/update/byId`,
      method: 'post',
      data: user
    })
  }
}

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
