<template>
  <div v-loading="loading">
    <!-- 搜索 -->
    <el-input
      size="small"
      clearable
      placeholder="输入名称或者描述搜索"
      style="width: 200px;"
    />
    <el-date-picker
      :default-time="['00:00:00','23:59:59']"
      type="daterange"
      range-separator=":"
      size="small"
      value-format="yyyy-MM-dd HH:mm:ss"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    />
    <!--  搜索和重置-->
    <span data-v-51d9ec9c="">
      <button type="button" class="el-button filter-item el-button--success el-button--mini" @click="query">
        <!---->
        <i class="el-icon-search" />
        <span>搜索</span></button>
      <button type="button" class="el-button filter-item el-button--warning el-button--mini">
        <!---->
        <i class="el-icon-refresh-left" /><span>重置</span></button></span>
    <!-- 增删改查 -->
    <div style="margin-top:17px;margin-bottom:28px">
      <!-- crud组件 -->
      <button type="button" class="el-button filter-item el-button--primary el-button--mini"><!----><i class="el-icon-plus" /><span>
        新增
      </span>
      </button>
      <button disabled="disabled" type="button" class="el-button filter-item el-button--success el-button--mini is-disabled"><!----><i class="el-icon-edit" /><span>
        修改
      </span>
      </button>
      <button slot="reference" disabled="disabled" type="button" class="el-button filter-item el-button--danger el-button--mini is-disabled"><!----><i class="el-icon-delete" /><span>
        删除
      </span>
      </button>
      <button type="button" class="el-button filter-item el-button--warning el-button--mini"><!---->
        <i class="el-icon-download" /><span>导出</span></button>
    </div>
    <!--  -->
    <!--角色管理-->
    <el-row :gutter="15">
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" style="margin-bottom: 10px">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">角色列表</span>
          </div>
          <!-- 角色表格 -->
          <el-table
            ref="table"
            :data="page.list"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            @sort-change="changeSort"
          >
            <el-table-column :selectable="checkboxT" type="selection" width="50px" align="center" />
            <el-table-column prop="roleId" label="角色ID" width="70px" align="center" />
            <el-table-column prop="roleName" label="名称" width="160px" align="center" />
            <el-table-column prop="rolePosition" label="数据权限" width="130px" align="center" />
            <el-table-column prop="rolePositionId" label="角色级别" width="130px" align="center" />
            <el-table-column prop="roleDescription" label="描述" align="center" />
            <el-table-column prop="createdTime" label="创建日期" width="200px" align="center" />
            <el-table-column
              label="操作"
              width="115"
              align="center"
              fixed="right"
            >
              <template>
                <el-button size="mini" type="primary" icon="el-icon-edit">
                  操作
                </el-button>
                <el-button style="margin-top:4px;margin-left: 0px" size="mini" type="primary" icon="el-icon-view">
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
          <div style="padding-top:17px">
            <el-pagination
              :current-page="page.currentPage"
              :page-sizes="[5, 10, 20, 50]"
              :page-size="page.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="page.totalCount"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
          <!-- 跳转页按钮 -->
          <el-form-item style="margin-top:17px;margin-left:10px">
            <el-button type="primary" sizi="mini" @click="query">确定</el-button>
          </el-form-item>
          <!--  -->
        </el-card>
      </el-col>
    </el-row>
    <!--  -->
  </div>
</template>

<script>
import roleApi from '../../../api/role'
export default {
  data() {
    return {
      // 角色信息
      role: [{
        roleId: '',
        roleName: '',
        rolePosition: '',
        rolePositionId: '',
        roleDescription: '',
        createdTime: '',
        updatedTime: ''
      }],
      // 定义page对象
      page: {
        currentPage: 1, // 当前页
        pageSize: 10, // 每页显示条数
        totalPage: 0, // 总页数
        totalCount: 0, // 总条数
        params: {
          'reportType': 0,
          'reportDate': ['', '']
        }, // 查询参数对象
        list: [], // 数据
        sortColumn: 'createdTime', // 排序列
        sortMethod: 'asc' // 排序方式
      },
      loading: true, // 控制是否显示延迟加载效果(懒加载)
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
    // 分页查询,调用api/role.js中封装的getByPage方法
    // 进行参数的绑定
    getByPage() {
      roleApi.getByPage(this.page).then(res => {
        this.page.currentPage = res.data.pageNum
        this.page.pageSize = res.data.pageSize
        this.page.totalPage = res.data.pages
        this.page.totalCount = res.data.total
        this.page.list = res.data.list
        this.loading = false
        // 这里的loading一定要设置为false，否则会一直加载下去
      })
    },
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
    handleSelectionChange(val) {
      this.selectXxxs = val
    },
    // 获取角色
    getByGroup() {
      roleApi.getByGroup(this.page).then(res => {
        console.log(res)
        this.role = res.data
      }).catch(error => {
        console.log(error)
        this.loading = false
      }
      )
    },
    // 查询用户数据
    query() {
      this.loading = false
      this.page.currentPage = 1
      this.getByPage()
    }
  }
}
</script>
