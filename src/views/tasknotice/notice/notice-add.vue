<template>
  <div>
    <!--添加表单  -->
    <el-form ref="addForm" :model="switchStatus" label-width="80px" size="mini">
      <el-form-item label="创建人">
        <el-input v-model="switchStatus.userName" disabled />
      </el-form-item>
      <el-form-item label="创建人ID">
        <el-input v-model="switchStatus.createdId" disabled />
      </el-form-item>
      <el-form-item label="通知标题">
        <el-input v-model="switchStatus.noticeTitle" />
      </el-form-item>
      <el-form-item label="通知内容">
        <el-input v-model="switchStatus.noticeContent" type="textarea" :autosize="{ minRows: 10, maxRows: 25}" />
      </el-form-item>
      <el-form-item>
        <el-button type="success" size="mini" :disabled="switchStatus.Enabled" @click="switchStatus.isDeleted === true || switchStatus.isEnabled === false?Pushed(switchStatus):onSubmit('push')">发布</el-button>
        <el-button type="primary" size="mini" :disabled="switchStatus.Enabled" @click="switchStatus.isDeleted === true || switchStatus.isEnabled === false?Saved(switchStatus):onSubmit('save')">保存</el-button>
        <el-button type="danger" size="mini" @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import noticeApi from '@/api/noticetask/notice'
import { mapGetters } from 'vuex'
export default {
  props: {
    data: {}
  },
  computed: {
    switchStatus: function() {
      this.panduan()
      return this.data
    },
    ...mapGetters([
      'name',
      'userid'
    ])
  },
  methods: {
    panduan() { // 判断id 、username 的值
      if (this.data.createdId == null) {
        this.data.createdId = this.userid
        this.data.userName = this.name
      }
    },
    // 添加 确认
    /**
       * 1、父组件可以使用 props 把数据传给子组件。
       * 2、子组件可以使用 $emit 触发父组件的自定义事件
       */
    onSubmit(data) {
      // eslint-disable-next-line eqeqeq
      if (data == 'push') {
        this.data.isEnabled = 1
      }
      // eslint-disable-next-line eqeqeq
      if (data == 'save') {
        this.data.isEnabled = 0
      }
      noticeApi.save(this.data).then(res => {
        this.$message.success(res.msg)
        this.$emit('closeAddDialog')
        this.notice = {}
        this.$emit('getByPage')
      })
    },
    Pushed(data) {
      this.$emit('closeAddDialog')
      if (this.data.isDeleted === true) {
        this.$emit('deletePushed', this.data)
      } else if (this.data.isEnabled === false) {
        data.isEnabled = true
        this.update(data)
      }
    },
    Saved(data) {
      this.update(data)
    },
    update(data) {
      noticeApi.update(this.data).then(res => {
        this.$message.success(res.msg)
        this.$emit('closeAddDialog')
        this.$emit('getByPage')
      })
    },
    close() {
      this.$emit('closeAddDialog')
      this.notice = {}
    }
  }
}
</script>
