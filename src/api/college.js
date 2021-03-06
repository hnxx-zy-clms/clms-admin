import request from '@/utils/request'
var group_name = 'college'
export default {
  getByPage(page, size, className) { // 分页查询
    return request({
      url: `/${group_name}/all/${page}/${size}/${className}`,
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
  },
  getAll(page) { // 查询
    return request({
      url: `/${group_name}/findAll`,
      method: 'post'
    })
  },
  delete(id) {
    return request({
      url: `/${group_name}/delete/${id}`,
      method: 'put'
    })
  },
  get(id) {
    return request({
      url: `/${group_name}/findClassById/${id}`,
      method: 'get'
    })
  },
  alter(classes) {
    return request({
      url: `/${group_name}/alter`,
      method: 'post',
      data: classes
    })
  },
  exportexcell(){
    return request({
      url: `/${group_name}/exportExcel`,
      method: 'get',
      responseType: 'blob'
    })
  },
  importExcel(formdata) {
    return request({
      url: `/${group_name}/importExcel`,
      method: 'post',
      data: formdata
    })
  }
}

