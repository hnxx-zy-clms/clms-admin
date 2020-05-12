import request from '@/utils/request'
var group_name = 'classes'
export default {
  getByPage(page, size) { // 分页查询
    return request({
      url: `/${group_name}/all/${page}/${size}`,
      method: 'get'
    })
  },
  update(id, type) { // 根据id更新
    return request({
      url: `/${group_name}/update/${id}/${type}`,
      method: 'put'
    })
  },
  save(classes) { // 保存
    return request({
      url: `/${group_name}/save`,
      method: 'post',
      data: classes
    })
  },
  updateByIds(ids) { // 批量删除
    return request({
      url: `/${group_name}/updateIds`,
      method: 'put',
      data: ids
    })
  }
}

