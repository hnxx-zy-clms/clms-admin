<template>
  <div>
    <el-form ref="addForm" :model="classes" label-width="80px" size="mini">
      <el-form-item label="学院名称">
        <el-input v-model="classes.collegeName" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="onSubmit">提交</el-button>
        <el-button size="mini" @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import xxxApi from '@/api/college'
export default {
  data() {
    return {
      classes: {
        'collegeName': ''
      }
    }
  },
  methods: {
    onSubmit() {
      xxxApi.save(this.classes).then(res => {
        this.$message.success(res.msg)
        this.$emit('closeAddDialog')
        this.classes = {}
        this.$emit('getByPage')
      })
    },
    close() {
      this.$emit('closeAddDialog')
      this.classes = {}
    }
  }
}
</script>
