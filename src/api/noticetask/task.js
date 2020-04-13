import request from '@/utils/request'
var group_name = 'task'

export default {
  getByPage(page) { // 分页查询
    return request({
      url: `/${group_name}/getByPageAdmin`,
      method: 'post',
      data: page
    })
  },
  getUserNum() { // 获取总人数
    return request({
      url: `/${group_name}/getUserNum`,
      method: 'get'
    })
  }
}
