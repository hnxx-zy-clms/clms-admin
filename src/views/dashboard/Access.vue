<template>
  <div id="container" />
</template>
<script>
import { Chart } from '@antv/g2'

const data = [
  { year: '05-03', value: 10 },
  { year: '05-04', value: 40 },
  { year: '05-05', value: 30 },
  { year: '05-06', value: 52 },
  { year: '05-07', value: 44 },
  { year: '05-08', value: 62 },
  { year: '05-09', value: 74 },
  { year: '05-10', value: 94 },
  { year: '05-11', value: 13 }
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
        container: 'container',
        autoFit: true,
        height: 300
      })

      chart.data(data)
      chart.scale({
        year: {
          range: [0, 1]
        },
        value: {
          min: 0,
          nice: true
        }
      })
      chart.tooltip({
        showCrosshairs: true, // 展示 Tooltip 辅助线
        shared: true
      })
      chart.line().position('year*value').label('value')
      chart.point().position('year*value')
      chart.render()
    }
  }
}
</script>

<style scoped>

</style>
