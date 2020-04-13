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
  update(data) { // 修改更新
    return request({
      url: `/${group_name}/update`,
      method: 'put',
      data: data
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
  saveenable(id, time) { // 保存To发布
    return request({
      url: `/${group_name}/saveTopush/${id}/${time}`,
      method: 'put'
    })
  },
  deleteenable(notice) { // 删除To发布
    return request({
      url: `/${group_name}/deleteTopush`,
      method: 'post',
      data: notice
    })
  },
  disable(id) { // 根据id弃用
    return request({
      url: `/${group_name}/disable/${id}`,
      method: 'put',
      data: id
    })
  },
  getUserId(name) { // 获取用户Id
    return request({
      url: `/${group_name}/getUserId/${name}`,
      method: 'get'
    })
  }
}
