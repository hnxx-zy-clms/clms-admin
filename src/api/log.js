import request from '@/utils/request'
var group_name = 'log'
export default {
  getByPage(page) { // 分页查询
    return request({
      url: `/${group_name}/getByPage`,
      method: 'post',
      data: page
    })
  },
  delete(logIds) { // 删除
    return request({
      url: `/${group_name}/deleteByIds`,
      method: 'put',
      data: logIds
    })
  }
}
