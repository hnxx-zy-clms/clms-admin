<template>
  <div v-loading="loading">
    <el-table
      ref="singleTable"
      :data="situation"
      highlight-current-row
      @current-change="handleCurrentChange"
      style="width: 100%">
      <el-table-column prop="userId" label="用户Id"  width="150"></el-table-column>
      <el-table-column prop="userName" label="用户姓名"  width="150"></el-table-column>
      <el-table-column prop="isDid" label="任务状态"  width="150">
        <template scope="scope">
          <sapn v-if="scope.row.isDid === true " style="color: rgb(41, 189, 139)">已完成</sapn>
          <sapn v-else-if="scope.row.isDid === false" style="color:rgb(221, 23, 23)">未完成</sapn>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import taskApi from '@/api/noticetask/task'
export default {
  data() {
    return {
      // 定义page对象
      page: {
        currentPage: 1, // 当前页
        pageSize: 10, // 每页显示条数
        totalPage: 0, // 总页数
        totalCount: 0, // 总条数
        params: {
          role: 'teacher'
        }, // 查询参数对象
        list: [], // 数据
        sortColumn: 'created_time', // 排序列
        sortMethod: 'desc' // 排序方式
      },
      loading: false, // 控制是否显示加载效果
      selectTask: [], // 被选中的模版列
      addDialog: false, // 控制添加弹窗显示
      taskId: this.$route.query.id,
      situation: [] // 任务完成情况
    }
  },
  created() {
    this.loading = true
    taskApi.getTaskSituation(this.page, this.taskId).then(res => {
      this.situation = res.data.list
      this.loading = false
    })
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
