import request from '@/utils/request'
var group_name = 'reportMarking'
export default {
  save(report) { // 保存添加
    return request({
      url: `/${group_name}/save`,
      method: 'post',
      data: report
    })
  },
  getByPage(page) { // 前台查询
    return request({
      url: `/${group_name}/getAllMarking`,
      method: 'post',
      data: page
    })
  },
  deleteById(id) { // 根据id删除
    return request({
      url: `/${group_name}/deleteAdmin/${id}`,
      method: 'delete'
    })
  }
}
