<template>
  <!-- 加载 -->
  <div v-loading="loading">

    <!-- 搜索栏 模糊查询-->
    <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
      <el-form-item label="用户名">
        <el-input v-model="page.params.userName" placeholder="用户名" clearable />
      </el-form-item>
      <el-form-item label="组ID">
        <el-input v-model="page.params.userGroupId" placeholder="组ID" clearable />
      </el-form-item>
      <el-form-item label="角色ID">
        <el-input v-model="page.params.userPositionId" placeholder="角色ID" clearable />
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
      <el-form-item>
        <el-button type="primary" sizi="mini" @click="query">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 分割线 -->
    <el-divider />
    <el-button type="success" class="add-button" size="mini" @click="adminExcelDownloads">导出当前数据</el-button>
    <!-- 列表 -->
    <!--
      1. :data v-bind:model="page.list" 绑定数据 分页对象的的list数据
      2. show-overflow-tooltip 超出部分隐藏
      3. @selection-change="handleSelectionChange" selection-change	当选择项发生变化时会触发该事件
      4. @sort-change="changeSort" sort-change 事件回中可以获取当前排序的字段名[prop]和排序顺序[order]
     -->
    <el-table
      ref="table"
      :data="page.list"
      border
      style="width: 100%"
      @sort-change="changeSort"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="工作内容:">
              <span>{{ props.row.workContent }}</span>
            </el-form-item>
            <el-form-item label="遇到的困难:">
              <span>{{ props.row.difficulty }}</span>
            </el-form-item>
            <el-form-item label="解决方法:">
              <span>{{ props.row.solution }}</span>
            </el-form-item>
            <el-form-item label="心得体会:">
              <span>{{ props.row.experience }}</span>
            </el-form-item>
            <el-form-item label="后续计划:">
              <span>{{ props.row.plan }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="reportId" label="#" width="60" align="center" />
      <el-table-column prop="userName" align="center" label="用户名" width="200" show-overflow-tooltip />
      <el-table-column prop="userGroupId" label="组ID" width="120" sortable="custom" align="center" />
      <el-table-column prop="userClassesId" label="班级ID" width="120" sortable="custom" align="center" />
      <el-table-column prop="createdTime" label="创建时间" width="200" sortable="custom" align="center" />
      <el-table-column prop="updatedTime" label="更新时间" width="200" sortable="custom" align="center" />
      <el-table-column prop="marking" label="批阅状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isChecked === 0" type="warning">组长未批阅</el-tag>
          <el-tag v-else-if="scope.row.isClassesChecked === 0" type="danger">班长未批阅</el-tag>
          <el-tag v-else-if="scope.row.isTeacherChecked === 1" type="success">教师已批阅</el-tag>
          <el-tag v-else-if="scope.row.isTeacherChecked === 0">教师未批阅</el-tag>
          <el-tag v-else type="success">组长已批阅</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="enable" label="用户编辑状态" width="200" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isDeleted === 1" type="danger">已删除</el-tag>
          <el-tag v-else-if="scope.row.isEnabled === 0" type="success">可编辑</el-tag>
          <el-tag v-else type="info">不可编辑</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240" align="center">
        <template slot-scope="scope">
          <!--          <el-button size="mini" type="primary" @click="toUpdate(scope.row.typeId)">修改</el-button>-->
          <el-button slot="reference" size="mini" type="primary" @click="toRead(scope.row)">查看</el-button>
          <el-button size="mini" type="danger" @click="toDelete(scope.row.reportId)">删除</el-button>
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
      :page-sizes="[2,10,20,50]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.totalCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 添加弹窗 -->
    <el-dialog title="添加" :visible.sync="addDialog">
      <article-add @closeAddDialog="closeAddDialog" @getByPage="getByPage" />
    </el-dialog>
    <!--
      修改弹窗
      :article="article" 用于传递参数对象
    -->
    <el-dialog title="修改" :visible.sync="updateDialog">
      <article-update :article="article" @closeUpdateDialog="closeUpdateDialog" @getByPage="getByPage" />
    </el-dialog>

  </div>
</template>

<script>
import reportApi from '@/api/report'
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
          'reportType': 0,
          'reportDate': ['', '']
        }, // 查询参数对象
        list: [], // 数据
        sortColumn: 'created_time', // 排序列
        sortMethod: 'asc' // 排序方式
      },
      report: {
        reportId: '',
        reportType: '',
        userName: '',
        userGroupId: '',
        userClassesId: '',
        workContent: '',
        difficulty: '',
        solution: '',
        experience: '',
        plan: '',
        createdTime: '',
        updatedTime: '',
        isEnabled: '',
        isDeleted: '',
        isChecked: '',
        isClassesChecked: '',
        isTeacherChecked: ''
      },
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
      content: '',
      loading: true, // 控制是否显示加载效果
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
      this.loading = true
      this.page.pageSize = val
      // 重新请求,刷新页面
      this.getByPage()
    },
    // 当前页跳转 参数 value 当前页(currentPage)
    handleCurrentChange(val) {
      this.loading = true
      this.page.currentPage = val
      this.getByPage()
    },
    query() {
      this.loading = true
      this.page.currentPage = 1
      this.getByPage()
    },
    adminExcelDownloads() {
      this.$confirm('确认是否下载？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '下载',
        cancelButtonText: '放弃下载'
      })
        .then(() => {
          reportApi.adminExcelDownloads(this.page).then(res => {
            const link = document.createElement('a')
            link.style.display = 'none'
            const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
            link.href = URL.createObjectURL(blob)
            // link.download = res.headers['content-disposition'] // 下载后文件名
            link.download = 'info' // 下载的文件名
            document.body.appendChild(link)
            link.click()
            this.$message({
              type: 'success',
              message: '下载成功'
            })
          }).catch(error => {
            alert('下载失败' + error)
          })
        })
        .catch(action => {
          this.$message({
            type: 'info',
            message: '取消下载'
          })
        })
    },
    // 分页方法 调用封装的方法 getByPage()
    getByPage() {
      reportApi.getByPage(this.page).then(res => {
        this.page = res.data
        this.loading = false
      }).catch(error => {
        console.log(error)
      }
      )
    },
    // 条件排序 e 和 val 都行
    changeSort(e) {
      this.loading = true
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
    // 查看
    toRead(row) {
      const $table = this.$refs.table
      this.page.list.forEach(item => {
        if (row.reportId !== item.reportId) {
          $table.toggleRowExpansion(item, false)
        }
      })
      $table.toggleRowExpansion(row)
    },
    // 删除
    toDelete(id) {
      this.$confirm('此报告批阅数据也将一起删除且数据不可恢复,是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        reportApi.deleteById(id).then(res => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
