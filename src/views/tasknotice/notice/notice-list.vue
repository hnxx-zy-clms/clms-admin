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
          <el-date-picker type="date" placeholder="选择日期" v-model="page.params.createdTime" style="width: 100%;" value-format="yyyy-MM-dd"></el-date-picker>
        </el-col>
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
      <el-table-column prop="noticeId" label="编号" width="60" align="center" />
      <el-table-column prop="noticeTitle" label="通知标题" width="150" align="center" />
      <el-table-column prop="createdTime" label="创建时间" sortable="custom" width="150" align="center" />
      <el-table-column prop="userName" label="创建人" width="150" align="center" />
      <el-table-column prop="numRead" :label="this.reading" width="130" align="center" />
      <el-table-column prop="isEnabled" label="状态" width="150" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isDeleted === true" type="danger" effect="dark">已删除</el-tag>
          <el-tag v-else-if="scope.row.isEnabled === true && scope.row.isDeleted === false" type="success" effect="dark">已发布</el-tag>
          <el-tag v-else effect="dark">已保存</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.noticeId)"
          >删除</el-button>
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
      :page-sizes="[10,20,50,100]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.totalCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 添加弹窗 -->
    <el-dialog title="添加" :visible.sync="addDialog">
      <notice-add @closeAddDialog="closeAddDialog" @getByPage="getByPage" />
    </el-dialog>

  </div>
</template>

<script>

import noticeApi from '@/api/noticetask/notice'

// 导入组件
import NoticeAdd from './notice-add'
export default {
  //  定义添加的组件
  components: {
    // eslint-disable-next-line vue/no-unused-components
    NoticeAdd
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
      selectNotice: [], // 被选中的模版列
      addDialog: false, // 控制添加弹窗显示
      totalNum: 0 // 总人数
    }
  },
  computed: {
    reading: function() {
      return '已读(总人数:' + this.totalNum + ')'
    }
  },
  // 初始化函数
  created() {
    this.getByPage()
    this.getUserNum()
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
        noticeApi.delete(val).then(res => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      })
    },
    // 分页方法 调用封装的方法 getByPage()
    getByPage() {
      noticeApi.getByPage(this.page).then(res => {
        this.page = res.data
      })
    },
    getUserNum() {
      noticeApi.getUserNum().then(res => {
        console.log(res.data)
        this.totalNum = res.data
      })
    },
    // 条件排序
    changeSort(e) {
      if (e.order) {
        const sortcColum = this.getKebabCase(e.prop)
        console.log(sortcColum)
        this.page.sortColumn = sortcColum
        this.page.sortMethod = e.order
      } else {
        this.page.sortColumn = ''
        this.page.sortMethod = 'asc'
      }
      noticeApi.getByPage(this.page).then(res => {
        this.page = res.data
        this.$message.success(res.msg)
      })
    },
    // 多选参数
    handleSelectionChange(val) {
      this.selectNotice = val
      console.log(this.selectNotice)
    },
    deleteByIds() {
      // 批量删除
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        const ids = []
        this.selectNotice.forEach(e => {
          ids.push(e.noticeId)
        })
        noticeApi.deleteByIds(ids).then(res => {
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
    // 弃用，启用状态更新
    // changeIsEnabled(val) {
    //   const id = val.xxId
    //   if (val.isEnabled) {
    //     XxxApi.enable(id).then(res => {
    //       this.$message.success(res.msg)
    //     })
    //   } else {
    //     XxxApi.disable(id).then(res => {
    //       this.$message.success(res.msg)
    //     })
    //   }
    // },
    // 模块功能组件
    openAddDialog() {
      // 打开添加弹窗
      this.addDialog = true
    },
    closeAddDialog() {
      // 关闭添加弹窗
      this.addDialog = false
    }
  }
}
</script>
