import request from '@/utils/request'
var group_name = 'registration'

export default {
  getRegistrationsByDate(date) { // 获取当日签到情况
    return request({
      url: `/${group_name}/getListByDate/${date}`,
      method: 'get'
    })
  },
  getRegistrations() { // 获取本周签到
    return request({
      url: `/${group_name}/getList`,
      method: 'get'
    })
  },
  getRegistrationName(classes, date) { // 获取签到姓名
    return request({
      url: `/${group_name}/getNameList/${classes}/${date}`,
      method: 'get'
    })
  }
}
