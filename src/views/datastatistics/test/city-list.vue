<template>
  <div id="c1"></div>
</template>
<script>
  import G2 from '@antv/g2'
  import { Chart } from '@antv/g2'
  export default {
    name: "spectaculars",
    data(){
      return{
        basicColumnChartProp:{
          data:[{ genre: 'Sports', sold: 275 },
            { genre: 'Strategy', sold: 115 },
            { genre: 'Action', sold: 120 },
            { genre: 'Shooter', sold: 350 },
            { genre: 'Other', sold: 150 }],
          container:'c1',
          width:700,
          height:600
        },
      }
    },
    methods:{
      test(){
        const data = this.basicColumnChartProp.data;
        const chart = new G2.Chart({
          container: this.basicColumnChartProp.container,
          width : this.basicColumnChartProp.width,
          height : this.basicColumnChartProp.height
        });
        chart.source(data);
        chart.interval().position('genre*sold').color('genre')
        chart.render();
      }
    },
    mounted() {
      this.test();
    },
  }
</script>
