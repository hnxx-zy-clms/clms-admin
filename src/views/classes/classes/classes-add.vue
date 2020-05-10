<template>
  <div>
    <!--添加表单  -->
    <el-form ref="addForm" :model="classes" label-width="80px" size="mini">
      <el-form-item label="班级名称">
        <el-input v-model="classes.classesName"/>
      </el-form-item>
      <el-form-item label="所属学院">
        <el-select v-model="classes.classesCollegeId" placeholder="请求状态" clearable filterable>
          <el-option :label="item.collegeName" :value="item.collegeId" v-for="item in a" :key="item.collegeId"/>
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
          'classesName': '',
        },
        a: []
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
      // 添加 确认
      /**
       * 1、父组件可以使用 props 把数据传给子组件。
       * 2、子组件可以使用 $emit 触发父组件的自定义事件
       */
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
