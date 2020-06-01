<template>
  <!-- 加载 -->
  <div v-loading="loading">

    <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
      <el-form-item label="报告类型">
        <el-select v-model="page.params.reportType" placeholder="报告类型" clearable filterable>
          <el-option
            v-for="item in reportTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="批阅类型">
        <el-select v-model="page.params.markingType" placeholder="批阅类型" clearable filterable>
          <el-option
            v-for="item in markingTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="报告起始日期">
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
    <el-divider />
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
            <el-form-item v-if="props.row.groupName != null " label="组长批阅数据">
              <span>评分：{{ props.row.groupLeaderScore }} 分 </span>
              <span>评语：{{ props.row.groupLeaderComment }}</span>
            </el-form-item>
            <el-table-item v-else>
              <span>暂无数据 </span>
            </el-table-item>
            <el-form-item v-if="props.row.monitorName != null" label="班长批阅数据">
              <span>评分：{{ props.row.monitorScore }} 分 </span>
              <span>评语：{{ props.row.monitorComment }}</span>
            </el-form-item>
            <el-form-item v-if="props.row.teacherName != null" label="教师批阅数据">
              <span>评分：{{ props.row.teacherScore }} 分 </span>
              <span>评语：{{ props.row.teacherComment }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        width="50"
        label="#"
      />
      <el-table-column prop="reportId" align="center" label="报告ID" width="50" show-overflow-tooltip />
      <el-table-column prop="marking" label="批阅状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.groupName === null " type="warning">组长未批阅</el-tag>
          <el-tag v-else-if="scope.row.monitorName === null" type="danger">班长未批阅</el-tag>
          <el-tag v-else-if="scope.row.teacherName === null " type="info">教师未批阅</el-tag>
          <el-tag v-else type="success">教师已批阅</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="组长批阅数据" width="200" align="center">
        <el-table-column prop="groupName" align="center" label="批阅人" sortable="custom" />
        <el-table-column prop="groupTime" align="center" label="批阅时间" sortable="custom" />
      </el-table-column>
      <el-table-column label="班长批阅数据" width="200" align="center">
        <el-table-column prop="monitorName" align="center" label="批阅人" sortable="custom" />
        <el-table-column prop="monitorTime" align="center" label="批阅时间" sortable="custom" />
      </el-table-column>
      <el-table-column label="教师批阅数据" width="200" align="center">
        <el-table-column prop="teacherName" align="center" label="批阅人" sortable="custom" />
        <el-table-column prop="teacherTime" align="center" label="批阅时间" sortable="custom" />
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="220" align="center">
        <template slot-scope="scope">
          <!--                    <el-button size="mini" type="primary" @click="toUpdate(scope.row.typeId)">编辑</el-button>-->
          <el-button slot="reference" size="mini" type="primary" @click="toRead(scope.row)">查看</el-button>
          <el-button size="mini" type="danger" @click="toDelete(scope.row.markingId)">清空</el-button>
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

  </div>
</template>

<script>
import reportMarkingApi from '@/api/marking'
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
        sortColumn: 'group_time', // 排序列
        sortMethod: 'desc' // 排序方式
      },
      marking: {
        markingId: '',
        reportId: '',
        groupLeaderScore: '',
        groupLeaderComment: '',
        groupName: '',
        groupTime: '',
        monitorScore: '',
        monitorComment: '',
        monitorName: '',
        monitorTime: '',
        teacherScore: '',
        teacherComment: '',
        teacherName: '',
        teacherTime: ''
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
      reportTypeList: [{
        value: '0',
        label: '日报'
      }, {
        value: '1',
        label: '周报'
      }],
      markingTypeList: [{
        value: 3,
        label: '组长已批阅'
      }, {
        value: 1,
        label: '班长已批阅'
      }, {
        value: 2,
        label: '教师已批阅'
      }],
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
    // 分页方法 调用封装的方法 getByPage()
    getByPage() {
      reportMarkingApi.getByPage(this.page).then(res => {
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
      this.$confirm('清空此批阅数据,是否清空?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        reportMarkingApi.deleteById(id).then(res => {
          this.$message.success(res.msg)
          this.getByPage()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消清空'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
