<template>
 <div>
   <el-card class="box-card" shadow="hover" body-style="{height:100px}">
     <div slot="header" class="clearfix" >
       <span>详情</span>
       <el-button style="float: right; padding: 3px 0" type="text" @click="goback">返回</el-button>
     </div>
     <div>
       <p style="font-size: 30px">{{reply.userName}}</p>
       <p style="color: #999999">任务状态：已完成</p>
       <p style="color: #999999">完成时间：{{reply.didTime}}</p>
       <p style="color: #999999">任务评分：<span style="color: #FF6800">{{taskLevel}}</span></p>
     </div>
     <el-divider>回复内容</el-divider>
     <div>
       <pre>{{reply.replyContent}}</pre>
     </div>
     <div>
       <template>
         <el-radio-group v-model="radio" :disabled = "this.reply.level != null?true:false">
           <el-radio :label="1">优秀</el-radio>
           <el-radio :label="2">良好</el-radio>
           <el-radio :label="3">及格</el-radio>
           <el-radio :label="4">未及格</el-radio>
         </el-radio-group>
         <el-button @click="setlevel(radio)" :disabled="this.reply.level != null?true:false"> 批阅</el-button>
       </template>
     </div>
   </el-card>

 </div>
</template>

<script>
import taskApi from '@/api/noticetask/task'
export default {
  data() {
    return {
      taskid: this.$route.query.taskid,
      userid: this.$route.query.userid,
      reply: {},
      radio: 0 // 等级
    }
  },
  created() {
    this.getTaskReply()
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    taskLevel() {
      if (this.reply.level === 1) { return '优秀' }
      if (this.reply.level === 2) { return '良好' }
      if (this.reply.level === 3) { return '及格' }
      if (this.reply.level === 4) { return '不及格' }
      if (this.reply.level == null) { return '暂未评分' }
    }
  },
  methods: {
    getTaskReply() {
      taskApi.getTaskReply(this.taskid, this.userid).then(res => {
        this.reply = res.data
      })
    },
    goback() {
      this.$router.go(-1)
    },
    setlevel(id) {
      taskApi.setLevel(id, this.reply.id).then(res => {
        this.$message.success(res.msg)
        this.getTaskReply()
      })
    }
  }
}
</script>

<style scoped>

</style>
