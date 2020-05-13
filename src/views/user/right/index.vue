<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />

  </div>
</template>

<script>
export default {

  data() {
    return {
      filterText: '',
      data2: [{
        id: 1,
        label: '普通用户',
        children: [{
          id: 4,
          label: '用户管理',
          children: [{
            id: 9,
            label: '用户查询'
          }, {
            id: 10,
            label: '用户导出'
          }]
        }]
      }, {
        id: 2,
        label: '管理员',
        children: [{
          id: 5,
          label: '用户管理'
        }, {
          id: 6,
          label: '系统监控'
        }]
      }, {
        id: 3,
        label: '超级管理员',
        children: [{
          id: 7,
          label: '用户管理'
        }, {
          id: 8,
          label: '角色管理'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  }
}
</script>

