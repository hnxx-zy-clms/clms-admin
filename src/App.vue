<template>
  <div id="app">
    <router-view />
    <div />
  </div>
</template>

<script>
export default {
  name: 'App'

}

</script>
<style>
  img {
    margin: auto;
    width: 100%;
  }
/* 滚动条的宽度 */
  ::-webkit-scrollbar {
    width: 5px;
    height: 8px;
  }
  /* 滚动条滑块样式 */
  ::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: rgb(154, 158, 155);
  }
/* 全局添加按钮样式 */
.add-button {
  margin-bottom: 15px;
}
/* 全局分页样式 */
.pagination {
  margin-top: 15px;
}
.el-divider--horizontal {
  margin: 0px 0px 15px 0px !important;
}
</style>
