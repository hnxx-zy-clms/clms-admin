<template>
  <el-container>
    <el-header>报告数据统计</el-header>
    <el-main>
      <div class="block">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :icon="activity.icon"
          :type="activity.type"
          :color="activity.color"
          :size="activity.size"
          :timestamp="activity.timestamp">
          {{activity.content}}
        </el-timeline-item>
      </el-timeline>
    </div>
    </el-main>
    <el-footer>@zzzz</el-footer>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      activities: [{
        content: 'haa',
        timestamp: '2018-04-12 20:46',
        size: 'large',
        type: 'primary',
        icon: 'el-icon-more'
      }, {
        content: 'aha',
        timestamp: '2018-04-03 20:46',
        color: '#0bbd87'
      }, {
        content: 'wwwas',
        timestamp: '2018-04-03 20:46',
        size: 'large'
      }, {
        content: 'qaq',
        timestamp: '2018-04-03 20:46'
      }]
    }
  }
}
</script>

<style scoped>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
</style>
