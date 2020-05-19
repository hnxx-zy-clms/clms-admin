import request from '@/utils/request'
var group_name = 'task'

export default {
  save(task) { // 添加，保存
    return request({
      url: `/${group_name}/save`,
      method: 'post',
      data: task
    })
  },
  delete(id) { // 根据id删除
    return request({
      url: `/${group_name}/delete/${id}`,
      method: 'put',
      data: id
    })
  },
  update(data) { // 修改更新
    return request({
      url: `/${group_name}/update`,
      method: 'put',
      data: data
    })
  },
  getByPage(page) { // 分页查询
    return request({
      url: `/${group_name}/getByPageAdmin`,
      method: 'post',
      data: page
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
  saveenable(id, time) { // 保存To发布
    return request({
      url: `/${group_name}/saveTopush/${id}/${time}`,
      method: 'put'
    })
  },
  deleteenable(task) { // 删除To发布
    return request({
      url: `/${group_name}/deleteTopush`,
      method: 'post',
      data: task
    })
  },
  getUserNum() { // 获取总人数
    return request({
      url: `/${group_name}/getUserNum`,
      method: 'get'
    })
  },
  getTaskSituation(page, taskid) { // 获取任务完成情况
    return request({
      url: `/${group_name}/getTaskSituation/${taskid}`,
      method: 'post',
      data: page
    })
  },
  getTask(id) { // 获取任务内容
    return request({
      url: `/${group_name}/gettask/${id}`,
      method: 'get'
    })
  },
  getTaskReply(taskid, userid) { // 获取学生任务回复内容
    return request({
      url: `/${group_name}/getTaskReply/${taskid}/${userid}`,
      method: 'get'
    })
  },
  setLevel(id, level) {
    return request({
      url: `/${group_name}/setlevel/${id}/${level}`,
      method: 'put'
    })
  },
  deleteFile(fileUrl) {
    return request({
      url: `/upload/deleteFile`,
      method: 'post',
      data: { baseUrl: fileUrl }
    })
  }
}
