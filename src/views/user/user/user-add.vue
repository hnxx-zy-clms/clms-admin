<template>
  <div>
    <!--添加弹窗表单-->
    <el-dialog ref="addFrom" width="570px">
      <el-form ref="form" :inline="true" :rules="rules" size="small" label-width="66px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.userName" /></el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import userApi from '@/api/user'
export default {
  data() {
    return {
      // 用户信息
      user: [{
        userId: '',
        userName: '',
        userPassword: '',
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
      }]
    }
  },
  methods: {
    // 添加 确认
    /**
     * 1、父组件可以使用 props 把数据传给子组件。
     * 2、子组件可以使用 $emit 触发父组件的自定义事件
     */
    onSubmit() {
      userApi.insertUser(this.article).then(res => {
        this.$message.success(res.msg)
        this.$emit('closeAddDialog')
        this.article = {}
        this.$emit('getByPage')
      })
    },
    close() {
      this.$emit('closeAddDialog')
      this.article = {}
    }
    // 分隔线
  }
}
</script>
