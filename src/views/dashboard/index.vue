<template>
  <div :style="{paddingBottom:'52px'}" class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6"><div class="grid-content bg-purple">
        <el-card shadow="hover">
          <div :style="{paddingBottom:'52px'}">
            <div :style="{float:'left'}"><el-avatar :src="userIcon" :size="60" /></div>
            <div :style="{paddingLeft:'120px'}">
              <p>{{ name }}</p>
              <p>管理员</p>
            </div>
          </div>
          <el-divider />
        </el-card>
      </div>
      </el-col>
      <el-col :span="6">
        <el-card :style="{minWidth:'200px',minHeight:'100px'}" shadow="hover">
          <p>文章统计</p>
          <p>1,575</p>
          <p>11,561</p>
          <p>当前评论总数</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card :style="{minWidth:'200px',minHeight:'100px'}" shadow="hover">
          <p>报告统计</p>
          <p>1,575</p>
          <p>11,561</p>
          <p>当前批阅总数</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card :style="{minWidth:'200px',minHeight:'100px'}" shadow="hover">
          <p>通知统计</p>
          <p>1,575</p>
          <p>11,561</p>
          <p>当前任务总数</p>
        </el-card>
      </el-col>
    </el-row>
    <!--        <el-card :style="{minWidth:'60px',minHeight:'30px',float:'left'}" shadow="hover">-->
    <!--        </el-card>-->
    <el-row :gutter="20">
      <el-col :style="{margin:'20 20 20 20'}" shadow="hover">
        <el-card :style="{float:'left',width:'24%',height:'310px',marginTop:'20px'}"  shadow="hover">
          <p :style="{marginLeft:'20%'}">待填内容1</p>
          <el-divider />
        </el-card>
        <div :style="{marginLeft:'25%'}">
          <p :style="{marginLeft:'45%'}">文章/评论最近趋势</p>
          <total :style="{width:'100%',height:'300px'}" />
        </div>
      </el-col>
      <el-col div :style="{margin:'20 20 20 20'}" shadow="hover">
        <el-card :style="{float:'left',width:'24%',height:'310px',marginTop:'20px'}"  shadow="hover">
          <p :style="{marginLeft:'20%'}">待填内容2</p>
          <el-divider />
        </el-card>
        <div :style="{marginLeft:'25%'}">
          <p :style="{marginLeft:'45%'}">最近七天用户访问趋势</p>
          <access :style="{width:'100%',height:'300px'}" />
        </div>
      </el-col>
      <el-col :style="{margin:'20 20 20 20'}" shadow="hover">
        <el-card :style="{float:'left',width:'24%',height:'310px',marginTop:'20px'}"  shadow="hover">
          <p :style="{marginLeft:'20%'}">待填内容3</p>
          <el-divider />
        </el-card>
        <div :style="{marginLeft:'25%'}">
          <p :style="{marginLeft:'45%'}">班级整体人员情况</p>
          <class :style="{width:'100%',height:'300px'}" />
        </div>
      </el-col>
    </el-row>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Access from './Access'
import Total from './total'
import Class from './class'
export default {
  name: 'Dashboard',
  components: {
    Access,
    Total,
    Class
  },

  computed: {
    ...mapGetters([
      'name',
      'userIcon'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
}
</style>
