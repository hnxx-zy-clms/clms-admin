import request from '@/utils/request'
var group_name = 'notice'
export default {
  save(notice) { // 添加，保存
    return request({
      url: `/${group_name}/save`,
      method: 'post',
      data: notice
    })
  },
  delete(id) { // 根据id删除
    return request({
      url: `/${group_name}/delete/${id}`,
      method: 'put',
      data: id
    })
  },
  getUserNum() {
    return request({
      url: `/${group_name}/getUserNum`,
      method: 'get'
    })
  },
  deleteByIds(ids) { // 批量删除
    const params = new URLSearchParams()
    params.append('ids', ids)
    return request({
      url: `/${group_name}/deleteByIds`,
      method: 'post',
      data: params
    })
  },
  update(xxx) { // 修改更新
    return request({
      url: `/${group_name}/update`,
      method: 'update',
      data: xxx
    })
  },
  get(id) { // 根据id查询
    return request({
      url: `/${group_name}/get/${id}`,
      method: 'get',
      data: id
    })
  },
  getByPage(page) { // 分页查询
    return request({
      url: `/${group_name}/getByPageAdmin`,
      method: 'post',
      data: page
    })
  },
  list() { // 查询所有
    return request({
      url: `/${group_name}/list`,
      method: 'get'
    })
  },
  enable(id) { // 根据id启用
    return request({
      url: `/${group_name}/enable/${id}`,
      method: 'put',
      data: id
    })
  },
  disable(id) { // 根据id弃用
    return request({
      url: `/${group_name}/disable/${id}`,
      method: 'put',
      data: id
    })
  }
}
