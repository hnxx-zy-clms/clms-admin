<template>
  <!-- 加载 -->
  <div v-loading="loading">

    <!-- 搜索栏 模糊查询-->
    <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
      <el-form-item label="模糊查询">
        <el-input v-model="page.params.xxName" placeholder="xxName" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" sizi="mini" @click="getByPage">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 分割线 -->
    <el-divider />
    <el-button type="primary" class="add-button" size="mini" @click="openAddDialog">添加</el-button>
    <el-button type="danger" class="add-button" size="mini" @click="deleteByIds">批量删除</el-button>

    <!-- 列表 -->
    <!--
      1. :data v-bind:model="page.list" 绑定数据 分页对象的的list数据
      2. show-overflow-tooltip 超出部分隐藏
      3. @selection-change="handleSelectionChange" selection-change	当选择项发生变化时会触发该事件
      4. @sort-change="changeSort" sort-change 事件回中可以获取当前排序的字段名[prop]和排序顺序[order]
     -->
    <el-table
      :data="page.list"
      border
      fit
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @sort-change="changeSort"
    >
      <el-table-column
        type="selection"
        align="center"
        width="45"
      />
      <el-table-column type="index" fixed="left" label="#" width="60" align="center" />
      <el-table-column prop="xxName" label="xx名称" width="150" align="center" />
      <el-table-column prop="createdTime" label="创建时间" width="200" align="center" sortable="custom" />
      <el-table-column prop="updateTime" label="更新时间" width="200" align="center" sortable="custom" />
      <el-table-column prop="enable" label="状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isEnabled === 1">启用</el-tag>
          <el-tag v-else type="info">弃用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="360" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="toUpdate(scope.row.xxId)">修改</el-button>
          <el-button size="mini" type="info" @click="toRead(scope.row.xxId)">查看</el-button>
          <el-button v-if="scope.row.isEnabled === 0" size="mini" type="success" @click="toEnable(scope.row.xxId)">启用</el-button>
          <el-button v-if="scope.row.isEnabled === 1" size="mini" type="warning" @click="toDisable(scope.row.xxId)">弃用</el-button>
          <el-button size="mini" type="danger" @click="toDelete(scope.row.xxId)">删除</el-button>

        </template>
      </el-table-column>
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
      :page-sizes="[5,10,20,50]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.totalCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 添加弹窗 -->
    <el-dialog title="添加" :visible.sync="addDialog">
      <xxx-add @closeAddDialog="closeAddDialog" @getByPage="getByPage" />
    </el-dialog>
    <!--
      修改弹窗
      :xxx="xxx" 用于传递参数对象
    -->
    <el-dialog title="修改" :visible.sync="updateDialog">
      <xxx-update :xxx="xxx" @closeUpdateDialog="closeUpdateDialog" @getByPage="getByPage" />
    </el-dialog>

  </div>
</template>

<script>
// 导入api接口定义的方法 接收变量为 xxxApi
import xxxApi from '@/api/sys/xxx'
// 导入组件
import XxxAdd from './xxx-add'
import XxxUpdate from './xxx-update'
export default {
  //  定义添加的组件 子组件/私有组件
  components: {
    XxxAdd,
    XxxUpdate
  },
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
        sortColumn: 'createdTime', // 排序列
        sortMethod: 'asc' // 排序方式
      },
      xxx: {
        xxId: ''
      },
      loading: false, // 控制是否显示加载效果
      selectXxxs: [], // 被选中的模版列
      addDialog: false, // 控制添加弹窗显示
      updateDialog: false // 控制修改弹窗显示
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
      xxxApi.getByPage(this.page).then(res => {
        this.page = res.data
        console.log(res)
      })
    },
    // 条件排序 e 和 val 都行
    changeSort(e) {
      if (e.order) {
        this.page.sortColumn = e.prop
        this.page.sortMethod = e.order
      } else {
        this.page.sortColumn = ''
        this.page.sortMethod = 'asc'
      }
      this.$message.success('操作成功!')
      this.getByPage()
    },
    // 多选参数
    handleSelectionChange(val) {
      this.selectXxxs = val
    },
    deleteByIds() {
      // 批量删除
      this.$confirm('删除之后无法恢复，是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        const ids = []
        this.selectXxxs.forEach(e => {
          ids.push(e.xxId)
        })
        xxxApi.deleteByIds(ids).then(res => {
          this.$message.success('res.msg')
          this.getByPage()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 操作部分相关方法
    // 修改
    toUpdate(id) {
      xxxApi.get(id).then(res => {
        this.xxx = res.data
        this.updateDialog = true
      })
    },
    // 查看
    toRead() {
      this.$message.success('QAQ')
    },
    // 启用
    toEnable(id) {
      this.$confirm('是否启用？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        xxxApi.enable(id).then(res => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消启用'
        })
      })
    },
    // 弃用
    toDisable(id) {
      this.$confirm('是否弃用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        xxxApi.disable(id).then(res => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消弃用'
        })
      })
    },
    // 删除
    toDelete(id) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        xxxApi.delete(id).then(res => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 模块功能组件
    openAddDialog() {
      // 打开添加弹窗
      this.addDialog = true
    },
    closeAddDialog() {
      // 关闭添加弹窗
      this.addDialog = false
    },
    closeUpdateDialog() {
      // 关闭修改弹窗
      this.updateDialog = false
    }
  }
}
</script>
