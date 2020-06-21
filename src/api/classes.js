import request from '@/utils/request'
import { getToken } from '@/utils/auth'
var group_name = 'classes'
export default {
  getByPage(page, size, className) { // 分页查询
    return request({
      url: `/${group_name}/all/${page}/${size}/${className}`,
      method: 'post'
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
  updateByIds(ids) { // 批量
    return request({
      url: `/${group_name}/updateIds`,
      method: 'put',
      data: ids
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

