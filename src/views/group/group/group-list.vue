<template>
  <div v-loading="loading">
    <!-- 搜索栏 模糊查询-->
    <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
      <el-form-item label="组名称">
        <el-input v-model="page.groupName" placeholder="组名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" sizi="mini" @click="getByPage">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 分割线 -->
    <el-divider />
    <el-button type="primary" class="add-button" size="mini" @click="openAddDialog">添加</el-button>
    <el-button type="primary" class="add-button" size="mini" @click="updateByIds">导出</el-button>
    <el-button type="primary" class="add-button" size="mini" @click="updateByIds">导入</el-button>
    <el-button type="danger" class="add-button" size="mini" @click="updateByIds">批量禁用</el-button>
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
      <el-table-column prop="groupId" label="#" width="60" align="center"/>
      <el-table-column prop="groupName" label="组名称" width="150" align="center"/>
      <el-table-column prop="groupStates" label="状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.groupStates === 1">启用</el-tag>
          <el-tag v-else type="info">弃用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="360" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.groupStates === 0" size="mini" type="success" @click="toEnable(scope.row.groupId)">启用
          </el-button>
          <el-button v-if="scope.row.groupStates === 1" size="mini" type="warning" @click="toDisable(scope.row.groupId)">弃用
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="toDelete(scope.row.groupId)"
          >删除
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="toUpdate(scope.row.groupId)"
          >修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
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
    <el-dialog title="添加" :visible.sync="addDialog">
      <xxx-add @closeAddDialog="closeAddDialog" @getByPage="getByPage"/>
    </el-dialog>
    <el-dialog title="修改" :visible.sync="updateDialog">
      <xxx-update :xxx="xxx" @closeUpdateDialog="closeUpdateDialog" @getByPage="getByPage"/>
    </el-dialog>

  </div>
</template>

<script>
import xxxApi from '@/api/group'
import XxxAdd from './group-add'
import XxxUpdate from './group-update'

export default {
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
        groupName: null,
        totalPage: 0, // 总页数
        totalCount: 0, // 总条数
        params: {}, // 查询参数对象
        list: [], // 数据
        sortColumn: 'createdTime', // 排序列
        sortMethod: 'asc' // 排序方式
      },
      xxx: {
        classesId: ''
      },
      loading: false, // 控制是否显示加载效果
      selectXxxs: [], // 被选中的模版列
      addDialog: false, // 控制添加弹窗显示
      updateDialog: false // 控制修改弹窗显示
    }
  },
  created() {
    this.getByPage()
  },
  // 定义方法
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
      if (this.page.groupName === '') {
        this.page.groupName = null
      }
      xxxApi.getByPage(this.page.currentPage, this.page.pageSize, this.page.groupName).then(res => {
        this.page.currentPage = res.data.pageNum
        this.page.pageSize = res.data.pageSize
        this.page.totalPage = res.data.pages
        this.page.totalCount = res.data.total
        this.page.list = res.data.list
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
    updateByIds() {
      this.$confirm('删除之后无法恢复，是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        const ids = []
        this.selectXxxs.forEach(e => {
          ids.push(e.groupId)
        })
        xxxApi.updateByIds(ids).then(res => {
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
        xxxApi.update(id, 1).then(res => {
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
        xxxApi.update(id,0).then(res => {
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
