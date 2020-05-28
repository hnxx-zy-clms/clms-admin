<template>
  <div class="accept-container">
    <!--退出显示-->
    <ul>
      <!--第三方显示列表-->
      <el-tag v-for="(item,index) in webAddress" :key="index">
        <a :href="item.link" target="_blank">{{ item.name }}</a>
      </el-tag>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 第三方地址
      webAddress: [
        {
          name: 'Druid',
          link: 'http://localhost:8080/druid/login.html'
        }
      ]
    }
  },
  // 当前页面完成渲染后获取iframe,控制显示位置
  mounted() {
  },
  methods: {

  }
}
</script>
<style scoped>
</style>
