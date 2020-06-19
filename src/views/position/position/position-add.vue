<template>
  <div>
    <!--添加表单  -->
    <el-form ref="addForm" :model="classes" label-width="80px" size="mini" :rules="addformrules">
      <el-form-item label="职称" prop="positionName">
        <el-input v-model="classes.positionName" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="onSubmit">提交</el-button>
        <el-button size="mini" @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import xxxApi from '@/api/position'
export default {
  data() {
    return {
      classes: {
        'positionName': ''
      },
      addformrules: {
        positionName: [{ required: true, message: '请输入职位名称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.addForm.validate(valid => {
        if (!valid) return
        xxxApi.save(this.classes).then(res => {
          this.$message.success(res.msg)
          this.$emit('closeAddDialog')
          this.classes = {}
          this.$emit('getByPage')
        })
      })
    },
    close() {
      this.$emit('closeAddDialog')
      this.classes = {}
    }
  }
}
</script>
