<template>
  <div>
    <!--修改弹窗表单-->
    <el-form ref="form" :inline="true" :model="user" :rules="rules" size="small" label-width="66px" class="addForm">
      <el-form-item label="用户名" prop="username"><el-input v-model="user.userName" /></el-form-item>
      <el-form-item label="密码" prop="userPassword"><el-input v-model="user.userPassword" /></el-form-item>
      <el-form-item label="姓名" prop="name"><el-input v-model="user.name" /></el-form-item>
      <el-form-item label="学院" prop="collegeName"><el-input v-model="user.collegeName" /></el-form-item>
      <el-form-item label="班级" prop="classesName"><el-input v-model="user.classesName" /></el-form-item>
      <el-form-item label="小组" prop="groupName"><el-input v-model="user.groupName" /></el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="user.sex" style="width: 178px">
          <el-radio :label="男">男</el-radio>
          <el-radio label="女">女</el-radio>
        </el-radio-group>
      </el-form-item><br>
      <el-form-item label="手机号" prop="mobile"><el-input v-model="user.mobile" class="phone" /></el-form-item>
    </el-form>
    <!--  取消和确认-->
    <div class="footer">
      <el-button type="text" @click="close">取消</el-button>
      <el-button type="primary" @click="onSubmit">确认</el-button>
    </div>
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
        sex: '男',
        mobile: '',
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
      userApi.updateById(this.user).then(res => {
        this.$message.success(res.msg)
        this.$emit('closeUpdateDialog')
        this.$emit('getByPage')
      })
    },
    close() {
      this.$emit('closeUpdateDialog')
      this.user = {}
    }
    // 分隔线
  }
}
</script>

<style>
  .addForm{
    width: 300px;
    height: 400px;
    display: inline;
  }
  .phone{
    width: 400px;
  }
  .footer{
    height: 30px;
    line-height: 30px;
    margin-left: 400px;
  }
</style>
