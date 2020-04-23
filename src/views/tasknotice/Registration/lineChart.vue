<template>
  <div :id="id" class="gcharts" />
</template>

<script>
import { Chart } from '@antv/g2'
export default {
  props: {
    charData: Array,
    id: String
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.drawChart()
  },
  methods: {
    drawChart() {
      this.chart = new Chart({
        container: this.id,
        width: 600,
        height: 300
      })
      this.chart.data(this.charData)
      this.chart.scale('num', {
        alias: '签到人数'
      })
      this.chart.axis('num', {
        title: {
        }
      })
      this.charData.forEach((item) => {
        this.chart
          .annotation()
          .text({
            position: [item.class, item.num],
            content: item.num,
            style: {
              textAlign: 'center'
            },
            offsetY: -10
          })
      })
      this.chart.annotation().text({
        top: true,
        position: ['start', 'end'],
        content: '点击柱形查看姓名',
        style: {
          fill: '#aaaaaa',
          fontSize: 16,
          fontWeight: 300
        },
        offsetX: -10,
        offsetY: 6
      })
      this.chart.on('click', (ev) => {
        this.$emit('getRegistrationName', ev.data.data.class)
      })
      this.chart.interval().position('class*num')
      this.chart.render()
    }
  }
}
</script>
<style lang='less' scope>
  .gcharts{
    width:100%;
    height:100%;
  }
</style>
