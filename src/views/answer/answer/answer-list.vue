<template>
  <!-- 加载 -->
  <div v-loading="loading">

    <!-- 搜索栏 模糊查询-->
    <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
      <el-form-item label="问题id">
        <el-input v-model="page.params.questionId" placeholder="请输入问题id" clearable />
      </el-form-item>
      <el-form-item label="答复内容">
        <el-input v-model="page.params.answerContent" placeholder="请输入答复内容的关键字" clearable />
      </el-form-item>
      <el-form-item label="答复人">
        <el-input v-model="page.params.answerAuthor" placeholder="请输入答复人" clearable />
      </el-form-item>
      <el-form-item label="答复状态">
        <el-select v-model="page.params.answerMark" placeholder="答复状态" width="80" clearable filterable>
          <el-option label="未采纳" :value="0" />
          <el-option label="已采纳" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="起始日期">
        <el-date-picker
          v-model="page.params.answerTime"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          :picker-options="pickerOptions"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" sizi="mini" @click="getByPage">查询</el-button>
        <el-button type="success" size="mini" @click="refresh">恢复</el-button>
      </el-form-item>
    </el-form>
    <!-- 分割线 -->
    <el-divider />
    <el-button type="primary" class="add-button" size="mini" @click="openAddDialog">添加</el-button>
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
      @sort-change="changeSort"
    >
      <el-table-column type="index" fixed="left" label="#" width="60" align="center" />
      <el-table-column prop="answerContent" label="答复内容" width="150" align="center" show-overflow-tooltip />
      <el-table-column prop="questionId" label="问题id" width="100" align="center" show-overflow-tooltip />
      <el-table-column prop="answerAuthor" label="答复人" width="100" align="center" />
      <el-table-column prop="answerGood" label="点赞量" width="100" align="center" sortable="custom" />
      <el-table-column prop="answerTime" label="答复时间" width="200" align="center" sortable="custom" />
      <el-table-column prop="updateTime" label="修改时间" width="200" align="center" sortable="custom" />
      <el-table-column prop="enable" label="状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.answerMark === 0" type="danger">未采纳</el-tag>
          <el-tag v-else>已采纳</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="360" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="toUpdate(scope.row.answerId)">修改</el-button>
          <el-button v-if="scope.row.answerMark === 0" size="mini" type="success" @click="toIsAdopt(scope.row.answerId)">设置为已采纳</el-button>
          <el-button v-if="scope.row.answerMark === 1" size="mini" type="warning" @click="toNoAdopt(scope.row.answerId)">设置为未采纳</el-button>
          <el-button size="mini" type="danger" @click="toDelete(scope.row.answerId)">删除</el-button>

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
      <answer-add @closeAddDialog="closeAddDialog" @getByPage="getByPage" />
    </el-dialog>
    <!--
      修改弹窗
      :answer="answer" 用于传递参数对象
    -->
    <el-dialog title="修改" :visible.sync="updateDialog">
      <answer-update :answer="answer" @closeUpdateDialog="closeUpdateDialog" @getByPage="getByPage" />
    </el-dialog>

  </div>
</template>

<script>
// 导入api接口定义的方法 接收变量为 xxxApi
import answerApi from '@/api/answer/answer'
// 导入组件
import AnswerAdd from './answer-add'
import AnswerUpdate from './answer-update'
export default {
  //  定义添加的组件 子组件/私有组件
  components: {
    AnswerAdd,
    AnswerUpdate
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      answerTime: {},
      // 定义page对象
      page: {
        currentPage: 1, // 当前页
        pageSize: 10, // 每页显示条数
        totalPage: 0, // 总页数
        totalCount: 0, // 总条数
        params: {}, // 查询参数对象
        list: [], // 数据
        sortColumn: 'answerTime', // 排序列
        sortMethod: 'asc' // 排序方式
      },
      answer: {
        answerId: ''
      },
      loading: true, // 控制是否显示加载效
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
      answerApi.getByPage(this.page).then(res => {
        this.page = res.data
        this.loading = false
        this.$message.success(res.msg)
      })
    },
    // 恢复搜索框
    refresh() {
      this.page.currentPage = 1
      this.page.params.questionId = null
      this.page.params.answerContent = null
      this.page.params.answerAnthor = null
      this.page.params.answerTime = null
      this.page.params.answerMark = null
      this.getByPage()
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
    // 操作部分相关方法
    // 修改
    toUpdate(id) {
      answerApi.get(id).then(res => {
        this.answer = res.data
        this.updateDialog = true
      })
    },
    // 设置为 已采纳
    toIsAdopt(id) {
      this.$confirm('是否设置答复状态:已采纳？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        answerApi.isAdopt(id).then(res => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消!'
        })
      })
    },
    // 设置为 未解决
    toNoAdopt(id) {
      this.$confirm('是否设置答复状态:未采纳？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        answerApi.noAdopt(id).then(res => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消!'
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
        answerApi.delete(id).then(res => {
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
