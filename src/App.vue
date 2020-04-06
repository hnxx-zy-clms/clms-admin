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
/* 全局添加按钮样式 */
.add-button {
  margin-bottom: 15px;
}
/* 全局分页样式 */
.pagination {
  margin-top: 15px;
}
</style>
