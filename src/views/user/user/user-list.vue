<template>
  <div v-loading="loading">
    <!-- 搜索栏 模糊查询-->
    <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
      <el-form-item label="用户名">
        <el-input v-model="page.params.userName" placeholder="输入用户名搜索" clearable />
      </el-form-item>
      <el-form-item label="组别">
        <el-select v-model="page.params.userGroupId" placeholder="组别" clearable filterable>
          <el-option
            v-for="item in groupList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="page.params.userPositionId" placeholder="角色" clearable filterable>
          <el-option
            v-for="item in positionList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="起始日期">
        <el-date-picker
          v-model="page.params.reportDate"
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
      <el-select
        clearable
        size="small"
        placeholder="状态"
        class="filter-item"
        style="width: 80px;margin-top:-2px;"
      >
        <el-option
          v-for="item in enabledTypeOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <span>
        <el-form-item style="margin-left:9px;margin-top:-2px">
          <el-button type="primary" size="small" @click="query">查询</el-button>
        </el-form-item>
      </span></el-form>
    <!-- 分割线 -->
    <!-- 增删改查 -->
    <div style="margin-bottom:28px">
      <!-- crud组件 -->
      <button type="button" class="el-button filter-item el-button--primary el-button--mini" @click="openAddDialog">
        <i class="el-icon-plus" /><span>
          新增
        </span>
      </button>
      <button type="button" class="el-button filter-item el-button--success el-button--mini" @click="openUpdateDialog">
        <i class="el-icon-edit" /><span>
          修改
        </span>
      </button>
      <el-button slot="reference" size="mini" type="warning" class="filter-item" @click="deleteOne">
        <i class="el-icon-delete" /><span>
          删除
        </span>
      </el-button>
      <button type="button" class="el-button filter-item el-button--warning el-button--mini"><!---->
        <i class="el-icon-download" /><span>导出</span></button>
    </div>
    <!-- 添加弹窗 -->
    <el-dialog title="添加" :visible.sync="addDialog" width="570px">
      <user-add @closeAddDialog="closeAddDialog" @getByPage="getByPage" />
    </el-dialog>
    <!-- 修改弹窗 -->
    <el-dialog title="修改" :visible.sync="updateDialog" width="570px">
      <user-update @closeUpdateDialog="closeUpdateDialog" @getByPage="getByPage" />
    </el-dialog>

    <el-row :gutter="20">
      <el-col>
        <!-- 用户数据表格 -->
        <el-table
          ref="table"
          border
          :data="page.list"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          @sort-change="changeSort"
        >
          <el-table-column :selectable="checkboxT" type="selection" width="60" align="center" />
          <el-table-column prop="userId" label="用户ID" width="80" align="center" />
          <el-table-column prop="userName" label="用户名" align="center" />
          <el-table-column prop="name" label="姓名" align="center" width="100px" />
          <el-table-column prop="userIcon" label="头像" align="center">
            <template slot-scope="scope">
              <el-image
                style="width: 60px;height: 50px"
                :src="scope.row.userIcon"
                :preview-src-list="[scope.row.userIcon]"
              />
            </template>
          </el-table-column>
          <el-table-column prop="classesName" label="班级" width="120" align="center" />
          <el-table-column prop="groupName" label="小组" width="120" align="center" />
          <el-table-column prop="createdTime" label="创建日期" width="180" align="center" />
          <el-table-column prop="updatedTime" label="更新日期" width="180" align="center" />
          <el-table-column prop="isEnabled" label="用户状态" width="120" align="center">
            <!--            注意:这里获取page中的list中的isEnabled对象的每一个用户的弃用弃用状态一定要用:active-value绑定每一个用户的状态字符否则会出现前端显示isEnabled为0的bug-->
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isEnabled"
                :disabled="user.userId === scope.row.userId"
                :active-value="1"
                :inactive-value="0"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="updateEnable(scope.row.userId, scope.row.isEnabled)"
              />
            </template>
          </el-table-column>
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
        <!-- 分页插件 -->
        <el-form :inline="true" class="demo-form-inline" size="mini" style="margin-left:150px">
          <!--  分页排序-->
          <el-form-item>
            <el-pagination
              align="left"
              class="pagination"
              :current-page="page.currentPage"
              :page-sizes="[5,10,20,50]"
              :page-size="page.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="page.totalCount"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-form-item>
          <!-- 跳转页按钮 -->
          <el-form-item style="margin-top:17px;margin-left:10px">
            <el-button type="primary" sizi="mini" @size-change="handleSizeChange" @click="jumpPage">确定</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import userApi from '@/api/user'
import userAdd from './user-add'
import userUpdate from './user-update'
import user from '../../../api/user'
export default {
  //  定义添加的组件 子组件/私有组件
  components: {
    userAdd,
    userUpdate
  },
  data() {
    return {
    // 用户信息
      user: [{
        userId: '',
        userName: '',
        userPassword: '',
        mobile: '',
        sex: '',
        userCollegeId: '',
        userClassId: '',
        userGroupId: '',
        userIcon: '',
        userDescription: '',
        createdTime: '',
        updatedTime: '',
        userPositionId: '',
        isEnabled: '',
        isDeleted: '',
        groupName: '',
        classesName: ''
      }],
      multipleSelection: [], // 被选中的行
      groupList: [],
      positionList: [],
      enabledTypeOptions: [],
      // checkboxT: [],
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
        }]
      },
      // 定义page对象
      length: 0,
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
    // 分页查询,调用api/user.js中封装的getByPage方法
    // 进行参数的绑定
    getByPage() {
      userApi.getByPage(this.page).then(res => {
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
    jumpPage() {
      this.$refs.pagination.handleCurrentChange(1)
      this.$emit('handleCurrentChange', 1)
    },
    // 改变选中状态
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // checkboxT(row, rowIndex) {
    //   return row.id !== this.user.userId
    // },
    // 获取用户
    getByGroup() {
      userApi.getByGroup(this.page).then(res => {
        console.log(res)
        this.loading = false
        this.user = res.data
      }).catch(error => {
        console.log(error)
      }
      )
    },
    // 查询用户数据
    query() {
      this.loading = false
      this.page.currentPage = 1
      this.getByPage()
    },
    // 新增用户
    add() {
      this.insertUser()
    },
    // 更新用户
    update() {
      this.updateById()
    },
    // 删除用户
    deleteOne() {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const selectedId = []
        this.multipleSelection.forEach(e => {
          selectedId.push(e.userId)
        })
        userApi.deleteOneById(selectedId).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getByPage()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    updateEnable(userId, isEnabled) {
      // 启用
      if (isEnabled === 1) {
        this.$confirm('是否启用？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          userApi.updateEnable(userId, isEnabled).then(res => {
            this.$message.success(res.msg)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消启用'
          })
          this.getByPage()
        })
      }
      if (isEnabled === 0) {
        // 弃用
        this.$confirm('是否弃用？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          userApi.updateEnable(userId, isEnabled).then(res => {
            this.$message.success(res.msg)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消弃用'
          })
          this.getByPage()
        })
      }
    },
    // 模块功能组件
    openAddDialog() {
      // 打开添加弹窗
      this.user = user
      this.addDialog = true
    },
    closeAddDialog() {
      // 关闭添加弹窗
      this.addDialog = false
    },
    openUpdateDialog() {
      // 打开修改弹窗
      this.user = user
      this.updateDialog = true
    },
    closeUpdateDialog() {
      // 关闭修改弹窗
      this.updateDialog = false
    }
  }
}
</script>
