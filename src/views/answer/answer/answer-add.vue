<template>
  <div>
    <!--添加表单  -->
    <el-form ref="addForm" :model="answer" label-width="80px" size="mini">
      <el-form-item label="问题id">
        <el-input v-model="answer.questionId" />
      </el-form-item>
      <el-form-item label="答复内容">
        <el-input v-model="answer.answerContent" type="textarea" />
      </el-form-item>
      <el-form-item label="答复人">
        <el-input v-model="answer.answerAuthor" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="onSubmit">提交</el-button>
        <el-button size="mini" @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import answerApi from '@/api/answer/answer'
export default {
  data() {
    return {
      answer: {}
    }
  },
  methods: {
    // 添加 确认
    /**
     * 1、父组件可以使用 props 把数据传给子组件。
     * 2、子组件可以使用 $emit 触发父组件的自定义事件
     */
    onSubmit() {
      answerApi.save(this.answer).then(res => {
        this.$message.success(res.msg)
        this.$emit('closeAddDialog')
        this.answer = {}
        this.$emit('getByPage')
      })
    },
    close() {
      this.$emit('closeAddDialog')
      this.answer = {}
    }
  }
}
</script>
