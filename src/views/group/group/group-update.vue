<template>
  <div>
    <!--修改表单  -->
    <el-form ref="form" :model="xxx" label-width="80px" size="mini">
      <el-form-item label="id">
        <el-input v-model="xxx.groupId" disabled/>
      </el-form-item>
      <el-form-item label="班级">
        <el-input v-model="xxx.groupName" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="onSubmit">提交</el-button>
        <el-button size="mini" @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import xxxApi from '@/api/group'
export default {
  props: {
    xxx: {
      type: Object,
      default: null
    }
  },
  methods: {
    onSubmit() {
      xxxApi.alter(this.xxx).then(res => {
        this.$message.success(res.msg)
        this.$emit('closeUpdateDialog')
        this.$emit('getByPage')
      })
    },
    close() {
      this.$emit('closeUpdateDialog')
    }
  }
}
</script>

<style scoped>

</style>
