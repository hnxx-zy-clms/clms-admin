<template>
  <div>
    <el-form ref="form" :model="user" label-width="80px" size="mini">
      <el-form-item label="账号">
        <el-input v-model="user.username" clearable />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="user.password" clearable type="password" />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="user.name" clearable />
      </el-form-item>
      <el-form-item label="性别">
        <el-radio v-model="user.sex" :label="1">男</el-radio>
        <el-radio v-model="user.sex" :label="2">女</el-radio>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="user.nickname" clearable />
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="user.userEmail" clearable />
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="uploadSuccess"
          :headers="headers"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="onSubmit">提交</el-button>
        <el-button size="mini">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import userApi from '@/api/myUser'
import md5 from 'js-md5'
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      user: {
        sex: 1
      },
      imageUrl: null, // 上传图片回显
      headers: { // 上传文件的请求头
        Authorization: getToken()
      },
      uploadUrl: process.env.VUE_APP_UPLOAD_URL // 上传图片路径
    }
  },
  methods: {
    onSubmit() {
      this.user.password = md5(this.user.password)
      userApi.save(this.user).then(res => {
        this.$message.success(res.msg)
        this.$emit('getByPage')
        this.$emit('closeAddDialog')
      })
    },
    uploadSuccess(res, file) {
      this.$message.success(res.msg)
      this.imageUrl = res.data
      this.user.header = res.data
    }
  }
}
</script>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
