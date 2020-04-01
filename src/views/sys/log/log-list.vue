<template>
  <!-- 加载 -->
  <div v-loading="loading">
    <!-- 搜索栏 -->
    <!--
      1. inline 行内表单模式 默认:false
      2. :model -- v-bind:model="page" 动态绑定数据 此处主要用于绑定参数列表
    -->
    <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
      <el-form-item label="请求地址">
        <el-input v-model="page.params.logUrl" placeholder="请求地址" clearable />
      </el-form-item>
      <el-form-item label="请求ip">
        <el-input v-model="page.params.logIp" placeholder="请求ip" clearable />
      </el-form-item>
      <el-form-item label="请求状态">
        <el-select v-model="page.params.logStatus" placeholder="请求状态" clearable filterable>
          <el-option label="正常" :value="1" />
          <el-option label="异常" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="请求方式">
        <el-select v-model="page.params.logMethod" placeholder="请求方式" clearable filterable>
          <el-option label="GET" value="GET" />
          <el-option label="POST" value="POST" />
          <el-option label="PUT" value="PUT" />
          <el-option label="DELETE" value="DELETE" />
        </el-select>
      </el-form-item>
      <!-- 表单按钮 -->
      <el-form-item>
        <el-button type="primary" sizi="mini" @click="getByPage">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 分割线 -->
    <el-divider />
    <el-button type="danger" class="add-button" size="mini" @click="deleteByIds">批量删除</el-button>

    <!-- 列表 -->
    <!--
      1. :data 绑定数据 分页对象的的list数据
      2. show-overflow-tooltip 超出部分隐藏
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
      <el-table-column prop="logId" label="编号" width="60" />
      <el-table-column prop="logUrl" label="请求地址" width="150" sortable="custom" />
      <el-table-column prop="logParams" label="参数" width="150" show-overflow-tooltip />
      <el-table-column prop="logStatus" label="请求状态" width="130" sortable="custom">
        <!-- scope 为作用域插槽 scope.row 为当前列的对象信息 -->
        <template slot-scope="scope">
          <!-- v-if / v-else 用于条件判断 -->
          <el-tag v-if="scope.row.logStatus === 1" type="success">正常</el-tag>
          <el-tag v-else type="danger">异常</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="logMethod" label="请求方式" width="110" sortable="custom" />
      <el-table-column prop="logTime" label="响应时间(毫秒)" width="160" sortable="custom" />
      <el-table-column prop="logIp" label="请求ip" width="150" />
      <el-table-column prop="logResult" label="返回值" width="250" show-overflow-tooltip />
      <el-table-column prop="createdTime" label="创建时间" sortable="custom" />
    </el-table>

    <!--
      分页组件-最完整版
      class : 分页组件
      current-page : 当前页 此处为动态绑定page对象的currentPage属性
      page-sizes : 每页显示个数选择器的选项设置
      page-size : 每页大小
      layout : 组件布局
      total : 总条目数 此处动态绑定page对象的totalCount属性
      @size-change="handleSizeChange"  pageSize 改变时会触发  参数:每页条数
      @current-change="handleCurrentChange" currentPage 改变时会触发 参数:当前页
     -->
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

  </div>
</template>

<script>
// 导入api接口定义的方法 接收变量为 xxxApi
import logApi from '@/api/log'
export default {
  data() {
    return {
      // 定义page对象
      page: {
        currentPage: 1, // 当前页
        pageSize: 10, // 每页显示条数
        totalPage: 0, // 总页数
        totalCount: 0, // 总条数
        params: {}, // 查询参数对象
        list: [], // 数据
        sortColumn: '', // 排序列
        sortMethod: 'asc' // 排序方式
      },
      loading: false, // 控制是否显示加载效果
      selectLogs: [] // 被选中的日志
    }
  },
  // 初始化函数
  created() {
    this.getByPage()
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
    // 分页方法 调用封装的方法 getByPage()
    getByPage() {
      logApi.getByPage(this.page).then(res => {
        this.page = res.data
      })
    },
    // 多选
    handleSelectionChange(val) {
      this.selectLogs = val
    },
    // 根据idS删除
    deleteByIds() {
      // 批量删除
      this.$confirm('删除之后无法恢复，是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        const logIds = []
        this.selectLogs.forEach(e => {
          logIds.push(e.logId)
        })
        logApi.deleteByIds(logIds).then(res => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      })
    },
    // 条件排序
    changeSort(e) {
      if (e.order) {
        this.page.sortColumn = e.prop
        this.page.sortMethod = e.order
      } else {
        this.page.sortColumn = ''
        this.page.sortMethod = 'asc'
      }
      this.getByPage()
    }
  }
}
</script>
