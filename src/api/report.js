import request from '@/utils/request'
var group_name = 'report'
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
      url: `/${group_name}/getByPage`,
      method: 'post',
      data: page
    })
  },
  update(report) { // 修改更新
    return request({
      url: `/${group_name}/update`,
      method: 'put',
      data: report
    })
  },
  deleteById(id) { // 根据id删除
    return request({
      url: `/${group_name}/deleteAdmin/${id}`,
      method: 'delete'
    })
  },
  adminExcelDownloads(page) { // 下载
    return request({
      url: `/${group_name}/adminExcelDownloads`,
      method: 'post',
      data: page,
      responseType: 'blob'
    })
  }
}
