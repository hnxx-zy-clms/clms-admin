<template>
  <!-- 加载 -->
  <div v-loading="loading">

    <!-- 搜索栏 模糊查询-->
    <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
      <el-form-item label="通知标题">
        <el-input v-model="page.params.Title" placeholder="输入标题" clearable />
      </el-form-item>
      <el-form-item label="创建人姓名">
        <el-input v-model="page.params.createdName" placeholder="输入姓名" clearable />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-col :span="18">
          <el-date-picker v-model="page.params.createdTime" type="date" placeholder="选择日期" style="width: 100%;" value-format="yyyy-MM-dd" />
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button v-loading.fullscreen.lock="loading" type="primary" sizi="mini" element-loading-text="请稍后" @click="selectBy(page)">查询</el-button>
        <el-button type="success" class="add-button" size="mini" @click="refresh">恢复</el-button>
      </el-form-item>
    </el-form>
    <!-- 分割线 -->
    <el-divider />
    <el-button type="primary" class="add-button" size="mini" @click="openAddDialog">添加</el-button>
    <el-button type="danger" class="add-button" size="mini" @click="deleteByIds">批量删除</el-button>

    <!-- 列表 -->
    <!--
      1. :data 绑定数据 分页对象的的list数据
      2. show-overflow-tooltip 超出部分隐藏
      3. @selection-change="handleSelectionChange" selection-change	当选择项发生变化时会触发该事件
     -->
    <el-table
      :data="page.list"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @sort-change="changeSort"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column prop="taskId" label="编号" width="60" align="center" />
      <el-table-column prop="taskTitle" label="通知标题" width="120" align="center" />
      <el-table-column prop="createdTime" label="创建时间" sortable="custom" width="135" align="center" />
      <el-table-column prop="pushedTime" label="发布时间" sortable="custom" width="135" align="center" />
      <el-table-column prop="userName" label="创建人" width="80" align="center" />
      <el-table-column prop="numDid" :label="this.did" width="130" align="center" />
      <el-table-column
        prop="isEnabled"
        label="状态"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isDeleted === true" type="danger" effect="dark">已删除</el-tag>
          <el-tag v-else-if="scope.row.isEnabled === true && scope.row.isDeleted === false" type="success" effect="dark">已发布</el-tag>
          <el-tag v-else effect="dark">已保存</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            :disabled="scope.row.isEnabled === true&&scope.row.isDeleted === false?true:false"
            @click="handleEdit(scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            plain
            type="info"
            @click="handleDetails(scope.row.taskId)"
          >详情</el-button>
          <el-button
            size="mini"
            plain
            :disabled="scope.row.isEnabled === true && scope.row.isDeleted === false?true:false"
            type="success"
            @click="scope.row.isDeleted === true?deletePushed(scope.row):savePushed(scope.row.taskId)"
          >发布</el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            :disabled="scope.row.isDeleted === true?true:false"
            @click="handleDelete(scope.row.taskId)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      align="center"
      class="pagination"
      :current-page="page.currentPage"
      :page-sizes="[10,20,50,100]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.totalCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 添加弹窗 -->
    <el-dialog title="添加" :visible.sync="addDialog">
      <task-add :data="task" @closeAddDialog="closeAddDialog" @getByPage="getByPage" @deletePushed="deletePushed" />
    </el-dialog>
    <router-view/>

  </div>
</template>

<script>

import taskApi from '@/api/noticetask/task'

// 导入组件
import TaskAdd from './task-add'
import { mapGetters } from 'vuex'
export default {
  //  定义添加的组件
  components: {
    // eslint-disable-next-line vue/no-unused-components
    TaskAdd
  },
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
      task: {},
      totalNum: 0 // 总人数
    }
  },
  computed: {
    did: function() {
      return '已完成(总人数:' + this.totalNum + ')'
    },
    ...mapGetters([
      'name',
      'userid'
    ])
  },
  // 初始化函数
  created() {
    this.getByPage()
    this.getUserNum()
    this.task.createdName = this.name
    this.task.createdId = this.userid
  },
  // 定义方法
  methods: {
    // 每页大小改变 参数 value 为每页大小(pageSize)
    handleSizeChange(val) {
      this.page.pageSize = val
      // 重新请求,刷新页面
      this.getByPage()
    },
    // 当前页跳转 参数 value 当前页(currentPage)
    handleCurrentChange(val) {
      this.page.currentPage = val
      this.getByPage()
    },
    handleDelete(val) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        taskApi.delete(val).then(res => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      })
    },
    handleEdit(row) {
      this.task = Object.assign({}, row)
      this.addDialog = true
    },
    // 分页方法 调用封装的方法 getByPage()
    getByPage() {
      this.loading = true
      taskApi.getByPage(this.page).then(res => {
        this.loading = false
        this.page = res.data
      })
    },
    refresh() {
      this.page.currentPage = 1
      this.page.params.Title = null
      this.page.params.createdName = null
      this.page.params.createdTime = null
      this.getByPage()
    },
    selectBy(data) {
      data.currentPage = 1
      this.getByPage()
    },
    getUserNum() {
      taskApi.getUserNum().then(res => {
        console.log(res.data)
        this.totalNum = res.data
      })
    },
    // 条件排序
    changeSort(e) {
      if (e.order) {
        const sortcColum = this.getKebabCase(e.prop)
        this.page.sortColumn = sortcColum
        this.page.sortMethod = e.order
      } else {
        this.page.sortColumn = ''
        this.page.sortMethod = 'asc'
      }
      taskApi.getByPage(this.page).then(res => {
        this.page = res.data
        this.$message.success(res.msg)
      })
    },
    // 多选参数
    handleSelectionChange(val) {
      this.selectTask = val
      console.log(this.selectTask)
    },
    deleteByIds() {
      // 批量删除
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        const ids = []
        this.selectTask.forEach(e => {
          ids.push(e.taskId)
        })
        taskApi.deleteByIds(ids).then(res => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      })
    },
    // 驼峰转换为_
    getKebabCase(str) {
      var arr = str.split('')
      str = arr.map(function(item) {
        if (item.toUpperCase() === item) {
          return '_' + item.toLowerCase()
        } else {
          return item
        }
      }).join('')
      return str
    },
    handleDetails(id) {
      this.$router.push({ path: 'details', query: { id }})
    },
    // 保存转为发布
    savePushed(id) {
      const time = new Date()
      taskApi.saveenable(id, time).then(res => {
        this.$message.success(res.msg)
        this.getByPage()
      })
    },
    // 删除转为发布
    deletePushed(val) {
      taskApi.deleteenable(val).then(res => {
        this.$message.success(res.msg)
        this.getByPage()
      })
    },
    // 模块功能组件
    openAddDialog() {
      // 打开添加弹窗
      this.task = {}
      this.addDialog = true
    },
    closeAddDialog() {
      // 关闭添加弹窗
      this.addDialog = false
    }
  }
}
</script>
