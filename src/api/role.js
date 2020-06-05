import request from '@/utils/request'
var group_name = 'role'
export default {
  getByPage(page) { // 分页查询用户信息
    // 向前端发送查询请求,传递的参数为page(page中封装了三个对象)
    return request({
      url: `/${group_name}/get/byPage`,
      method: 'post',
      data: page
    })
  }
}
