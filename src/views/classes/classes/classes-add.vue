<template>
  <div>
    <el-form ref="addForm" :model="classes" label-width="80px" size="mini" :rules="addformrules">
      <el-form-item label="班级名称" prop="classesName">
        <el-input v-model="classes.classesName" />
      </el-form-item>
      <el-form-item label="所属学院">
        <el-select v-model="classes.classesCollegeId" placeholder="请求状态" clearable filterable>
          <el-option v-for="item in a" :key="item.collegeId" :label="item.collegeName" :value="item.collegeId" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="onSubmit">提交</el-button>
        <el-button size="mini" @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import xxxApi from '@/api/classes'
import collegeApi from '@/api/college'

export default {
  data() {
    return {
      classes: {
        'classesName': ''
      },
      a: [],
      addformrules: {
        classesName: [{ required: true, message: '请输入班级名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getAll()
  },
  methods: {
    getAll() {
      collegeApi.getAll().then(res => {
        this.a = res.data
      })
    },
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
