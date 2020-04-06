<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" class="main" />
    </transition>
  </section>
</template>

<script>
import typeApi from '@/api/type'
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  },
  created() {
    this.getTypeList()
  },
  methods: {
    getTypeList() {
      typeApi.getList().then(res => {
        this.$store.commit('global/SET_TYPE', res.data)
      })
    }
  }
}
</script>

<style scoped>
.main {
  margin: 15px;
}
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
