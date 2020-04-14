<template>
  <div>
    <!--修改表单  -->
    <el-form ref="form" :model="xxx" label-width="80px" size="mini">
      <el-form-item label="xxName">
        <el-input v-model="xxx.xxName" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="onSubmit">提交</el-button>
        <el-button size="mini" @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import xxxApi from '@/api/sys/xxx'
export default {
  // 父组件将数据传递给子组件
  props: {
    xxx: {
      type: Object,
      default: null
    }
  },
  methods: {
    // 修改
    /**
     * 1、父组件可以使用 props 把数据传给子组件。
     * 2、子组件可以使用 $emit 触发父组件的自定义事件
     */
    onSubmit() {
      xxxApi.update(this.xxx).then(res => {
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
