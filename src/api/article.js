import request from '@/utils/request'
var group_name = 'article'
export default {
  save(article) { // 保存添加
    return request({
      url: `/${group_name}/save`,
      method: 'post',
      data: article
    })
  },
  getByPage(page) { // 前台查询
    return request({
      url: `/${group_name}/getByPage`,
      method: 'post',
      data: page
    })
  },
  update(article) { // 修改更新
    return request({
      url: `/${group_name}/update`,
      method: 'put',
      data: article
    })
  },
  deleteById(id) { // 根据id删除
    return request({
      url: `/${group_name}/delete/${id}`,
      method: 'delete'
    })
  },
  get(id) { // 根据id查询
    return request({
      url: `/${group_name}/get/${id}`,
      method: 'get'
    })
  }
}
