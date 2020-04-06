<template>
  <div>
    <el-button type="primary" class="add-button" size="mini" @click="openAddDialog">添加</el-button>

    <!-- 列表 -->
    <el-table :data="typeList" border style="width: 100%">
      <el-table-column prop="typeId" label="#" width="60" align="center" />
      <el-table-column prop="typeName" label="分类名称" width="200" align="center" />
      <el-table-column prop="typeCount" label="文章数" align="center" />
      <el-table-column prop="createdTime" label="创建时间" width="180" align="center" sortable="custom" />
      <el-table-column prop="updateTime" label="更新时间" width="180" align="center" sortable="custom" />
      <el-table-column prop="enable" label="启用" width="80" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isEnabled === 1">启用</el-tag>
          <el-tag v-else type="info">未启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="360" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="toUpdate(scope.row.typeId)">修改</el-button>
          <el-button size="mini" type="info" :disabled="true" @click="toRead(scope.row.typeId)">查看</el-button>
          <el-button v-if="scope.row.isEnabled === 0" size="mini" type="success" @click="toEnable(scope.row.typeId)">启用</el-button>
          <el-button v-if="scope.row.isEnabled === 1" size="mini" type="warning" @click="toDisable(scope.row.typeId)">弃用</el-button>
          <el-button size="mini" type="danger" @click="toDelete(scope.row.typeId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加抽屉 -->
    <el-dialog title="添加" :visible.sync="addDialog">
      <type-add @getTypeList="getTypeList" @closeAddDialog="closeAddDialog" />
    </el-dialog>

    <!-- 修改弹窗 -->
    <el-dialog title="修改" :visible.sync="updateDialog">
      <type-update :type="type" @getTypeList="getTypeList" @closeUpdateDialog="closeUpdateDialog" />
    </el-dialog>
  </div>
</template>

<script>
import typeApi from '@/api/type'
import TypeAdd from './type-add'
import TypeUpdate from './type-update'
export default {
  components: {
    TypeAdd,
    TypeUpdate
  },
  data() {
    return {
      type: {}, // 分类
      updateDialog: false, // 控制修改弹窗展示
      addDialog: false, // 控制添加弹窗展示
      typeList: [] // 类型数组
    }
  },
  created() {
    this.getTypeList()
  },
  methods: {
    getTypeList() {
      // 查询类型列表
      typeApi.getAll().then(res => {
        console.log(res)
        this.typeList = res.data
      })
    },
    toUpdate(id) {
      // 修改
      typeApi.get(id).then(res => {
        this.type = res.data
        this.updateDialog = true
      })
    },
    toEnable(id) {
      // 启用
      this.$confirm('是否启用该分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        typeApi.enableById(id).then(res => {
          this.$message.success(res.msg)
          this.getTypeList()
        })
      })
    },
    toDisable(id) {
      // 弃用
      this.$confirm('是否弃用该分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        typeApi.disableById(id).then(res => {
          this.$message.success(res.msg)
          this.getTypeList()
        })
      })
    },
    toDelete(id) {
      // 删除
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        typeApi.deleteById(id).then(res => {
          this.$message.success(res.msg)
          this.getTypeList()
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
