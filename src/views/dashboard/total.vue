<template>
  <div id="container1" />
</template>
<script>
import { Chart } from '@antv/g2'

const data = [
  { name: '文章', 月份: 'Jan.', 月均降雨量: 18.9 },
  { name: '文章', 月份: 'Feb.', 月均降雨量: 28.8 },
  { name: '文章', 月份: 'Mar.', 月均降雨量: 39.3 },
  { name: '文章', 月份: 'Apr.', 月均降雨量: 81.4 },
  { name: '文章', 月份: 'May', 月均降雨量: 47 },
  { name: '文章', 月份: 'Jun.', 月均降雨量: 20.3 },
  { name: '文章', 月份: 'Jul.', 月均降雨量: 24 },
  { name: '文章', 月份: 'Aug.', 月均降雨量: 35.6 },
  { name: '评论', 月份: 'Jan.', 月均降雨量: 12.4 },
  { name: '评论', 月份: 'Feb.', 月均降雨量: 23.2 },
  { name: '评论', 月份: 'Mar.', 月均降雨量: 34.5 },
  { name: '评论', 月份: 'Apr.', 月均降雨量: 99.7 },
  { name: '评论', 月份: 'May', 月均降雨量: 52.6 },
  { name: '评论', 月份: 'Jun.', 月均降雨量: 35.5 },
  { name: '评论', 月份: 'Jul.', 月均降雨量: 37.4 },
  { name: '评论', 月份: 'Aug.', 月均降雨量: 42.4 }
]
export default {
  name: 'Access',
  data() {
    return {
      data
    }
  },
  mounted() {
    this.initAccess()
  },
  methods: {
    initAccess() {
      const chart = new Chart({
        container: 'container1',
        autoFit: true,
        height: 500
      })

      chart.data(data)
      chart.scale('月均降雨量', {
        nice: true
      })
      chart.tooltip({
        showMarkers: false,
        shared: true
      })

      chart
        .interval()
        .position('月份*月均降雨量')
        .color('name')
        .adjust([
          {
            type: 'dodge',
            marginRatio: 0
          }
        ])

      chart.interaction('active-region')

      chart.render()
    }
  }
}
</script>

<style scoped>

</style>
