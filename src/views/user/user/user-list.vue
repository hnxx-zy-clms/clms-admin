<template>
  <div>
    <!-- 搜索栏 -->
    <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
      <el-form-item label="账号">
        <el-input v-model="page.params.username" placeholder="账号" clearable />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="page.params.name" placeholder="姓名" clearable />
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="page.params.nickname" placeholder="昵称" clearable />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="page.params.userEmail" placeholder="邮箱" clearable />
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="page.params.sex" placeholder="性别" clearable filterable>
          <el-option label="男" :value="1" />
          <el-option label="女" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" sizi="mini" @click="getByPage">查询</el-button>
      </el-form-item>
    </el-form>
    <el-divider />
    <el-button type="primary" class="add-button" size="mini" @click="openAddDialog">添加</el-button>
    <el-button type="primary" class="add-button" size="mini" @click="resetPwd">重置密码</el-button>

    <!-- 列表 -->
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
      <el-table-column prop="userId" label="用户编号" />
      <el-table-column prop="username" label="账号" />
      <el-table-column prop="sex" label="性别" width="70" sortable="custom">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.sex === 1" type="success">男</el-tag>
          <el-tag v-else type="danger">女</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="header" label="头像" width="120">
        <template slot-scope="scope">
          <el-image
            style="width: 100%;height: 100px"
            :src="scope.row.header"
            :preview-src-list="[scope.row.header]"
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="userEmail" label="邮箱" />
      <el-table-column prop="createdTime" label="创建时间" sortable="custom" />
      <el-table-column prop="updateTime" label="修改时间" sortable="custom" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-dropdown>
            <el-button type="primary" size="mini">
              操作
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button size="mini" type="primary" @click="handleEdit(scope.row.userId)">编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row.userId)">删除</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
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
      <user-add @closeAddDialog="closeAddDialog" @getByPage="getByPage" />
    </el-dialog>

    <!-- 修改弹窗 -->
    <el-dialog title="修改" :visible.sync="updateDialog">
      <user-update :user="user" @closeUpdateDialog="closeUpdateDialog" @getByPage="getByPage" />
    </el-dialog>

  </div>
</template>

<script>
import userApi from '@/api/myUser'
import UserAdd from './user-add'
import UserUpdate from './user-update'
export default {
  components: {
    UserAdd,
    UserUpdate
  },
  data() {
    return {
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
      selectUsers: [], // 被选中的用户
      user: {},
      addDialog: false,
      updateDialog: false
    }
  },
  created() {
    this.getByPage()
  },
  methods: {
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getByPage()
    },
    handleCurrentChange(val) {
      this.page.currentPage = val
      this.getByPage()
    },
    getByPage() {
      userApi.getByPage(this.page).then(res => {
        this.page = res.data
      })
    },
    handleSelectionChange(val) {
      this.selectUsers = val
    },
    resetPwd() {
      const userIds = []
      this.selectUsers.forEach(e => {
        userIds.push(e.userId)
      })
      userApi.resetPwd(userIds).then(res => {
        this.$message.success(res.msg)
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
      this.getByPage()
    },
    handleEdit(id) {
      userApi.get(id).then(res => {
        this.user = res.data
        this.updateDialog = true
      })
    },
    handleDelete(id) {
      // 删除
      this.$confirm('是否删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        userApi.deleteById(id).then(res => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      })
    },
    openAddDialog() {
      this.addDialog = true
    },
    closeAddDialog() {
      this.addDialog = false
    },
    closeUpdateDialog() {
      this.updateDialog = false
    }
  }
}
</script>
