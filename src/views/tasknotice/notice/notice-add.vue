<template>
  <div>
    <!--添加表单  -->
    <el-form ref="addForm" :model="notice" label-width="80px" size="mini">
      <el-form-item label="创建人">
        <el-input v-model="notice.createdId" />
      </el-form-item>
      <el-form-item label="通知标题">
        <el-input v-model="notice.noticeTitle" />
      </el-form-item>
      <el-form-item label="通知内容">
        <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 25}" v-model="notice.noticeContent" />
      </el-form-item>
      <el-form-item>
        <el-button type="success" size="mini" @click="onSubmit('push')">发布</el-button>
        <el-button type="primary" size="mini" @click="onSubmit('save')">保存</el-button>
        <el-button type="danger"  size="mini" @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import noticeApi from '@/api/noticetask/notice'
export default {
  data() {
    return {
      notice: {}
    }
  },
  methods: {
    // 添加 确认
    /**
       * 1、父组件可以使用 props 把数据传给子组件。
       * 2、子组件可以使用 $emit 触发父组件的自定义事件
       */
    onSubmit(data) {
      // eslint-disable-next-line eqeqeq
      if (data == 'push') {
        this.notice.isEnabled = 1
      }
      // eslint-disable-next-line eqeqeq
      if (data == 'save') {
        this.notice.isEnabled = 0
      }
      noticeApi.save(this.notice).then(res => {
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
  }
}
</script>
