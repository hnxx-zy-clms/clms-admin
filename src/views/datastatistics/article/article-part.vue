<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="文章类型统计" name="first">
        <div id="c2" />
        <div id="c1" />
        <div class="tips">
          <el-tooltip content="点击图表下方的字段名将其隐藏以便更好的观察所需数据的情况" placement="bottom" effect="light">
            <el-button>Tips</el-button>
          </el-tooltip>
        </div>
      </el-tab-pane>
      <el-tab-pane label="文章排名统计" name="second">
        <div id="choose">
          <span class="myspan">请选择排序规则：</span>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <!-- <el-button type="primary" class="mybutton" @click="makeit">提交</el-button> -->
        </div>
        <div id="c3" />
        <div class="tips">
          <el-tooltip content="点击图表下方的字段名将其隐藏以便更好的观察所需数据的情况" placement="bottom" effect="light">
            <el-button>Tips</el-button>
          </el-tooltip>
        </div>
        <!-- <div id="card"> -->
        <el-card class="box-card">
          <!-- <div v-for="o in 4" :key="o" class="text item">{{'列表内容 ' + o }}</div> -->
          <h2>文章{{ this.value }}排名</h2>
          <div class="text item">TOP1 {{ data[0].name }}</div>
          <div class="text item">TOP2 {{ data[1].name }}</div>
          <div class="text item">TOP3 {{ data[2].name }}</div>
        </el-card>
        <!-- </div> -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import typeApi from '@/api/article/type'
import articleApi from '@/api/article/article'
import G2 from '@antv/g2'
import { Chart } from '@antv/g2'
export default {
  name: 'Bing',
  data() {
    return {
      chart: null,
      chart1: null,
      chart2: null,
      typeparam: {
        sortColumn: 'type_count',
        sortMethod: 'desc'
      },
      topparam: {
        pageSize: 3,
        currentPage: 1,
        sortColumn: 'goodCounts',
        sortMethod: 'desc'
      },
      mydata: [
        { name: 'SpringBoot', count: 30, percent: 0.4 },
        { name: 'Java', count: 21, percent: 0.21 },
        { name: 'C', count: 17, percent: 0.17 },
        { name: 'Python', count: 13, percent: 0.13 },
        { name: 'MySql', count: 9, percent: 0.09 },
        // { name: '软件工程', countMap: { typeCounts: 5 }, percent: 0.5 },
        // { name: '软件工程1', countMap: { typeCounts: 5 }, percent: 0.5 }
      ],
      data: [
        { name: '发表数', author: '张三', count: 30 },
        { name: '发表数', author: '李四', count: 25 },
        { name: '发表数', author: '王五', count: 19 },

        { name: '获赞数', author: '张三', count: 53 },
        { name: '获赞数', author: '李四', count: 49 },
        { name: '获赞数', author: '王五', count: 36 },

        { name: '收藏数', author: '张三', count: 13 },
        { name: '收藏数', author: '李四', count: 9 },
        { name: '收藏数', author: '王五', count: 6 },

        { name: '评论数', author: '张三', count: 59 },
        { name: '评论数', author: '李四', count: 43 },
        { name: '评论数', author: '王五', count: 66 },

        { name: '浏览数', author: '张三', count: 110 },
        { name: '浏览数', author: '李四', count: 99 },
        { name: '浏览数', author: '王五', count: 88 }
      ],
      activeName: 'first',
      // sortColumn: 'type_count',
      // sortMethod: 'desc',
      options: [
        {
          value: '发表数',
          label: '发表数'
        },
        {
          value: '获赞数',
          label: '获赞数'
        },
        {
          value: '收藏数',
          label: '收藏数'
        },
        {
          value: '评论数',
          label: '评论数'
        },
        {
          value: '浏览数',
          label: '浏览数'
        },
        {
          value: '收藏数',
          label: '收藏数'
        }
      ],
      value: '发表数'
    }
  },
  watch: {
    mydata(b, a) {
      // console.log('监听到总体数据', b)
      this.chart1.changeData(b)
      this.chart.changeData(b)
      this.chart1.render()
      this.chart.render()
    },
    data(b, a) {
      this.chart2.changeData(b)
      this.chart2.render()
    }
  },
  mounted() {
    // this.getData()
    this.initComponent()
    this.initComponent1()
    // this.getData()
    // console.log('mounted开始')
  },
  created() {
    this.getData()
    this.getTopData()
  },

  methods: {
    getData() {
      typeApi.getArticleTypeCountInfo(this.typeparam).then(res => {
        // console.log('获取的数据是:', res.data.list)
        this.mydata = res.data.list
        // console.log('现在的是:', this.mydata)
      })
    },
    getTopData() {
      articleApi.getArticleCountInfo(this.topparam).then(res => {
        this.data = res.data.list
        console.log('现在的是:', this.data)
      })
    },
    handleClick(tab, event) {
      // this.getData()
      // this.initComponent()
      // this.initComponent1()
      this.chart.render()
      this.chart1.render()
      this.chart2.render()
      // console.log(tab, event)
    },
    initComponent() {
      const chart = new Chart({
        container: 'c1',
        autoFit: true,
        height: 400
      })

      chart.data(this.mydata)

      // 设置坐标系类型
      chart.coordinate('theta', {
        radius: 0.7
      })

      console.log(this.mydata)

      // 设置percent字段显示方式
      chart.scale('percent', {
        formatter: val => {
          val = (val * 100).toFixed(2) + '%'
          return val
        }
      })

      chart.tooltip({
        showTitle: false,
        showMarkers: false
      })

      // 不显示坐标轴
      chart.axis(false)

      const interval = chart
        .interval()
        .adjust('stack') // 数据调整方式
        .position('percent')
        .color('name')
        .label('percent', {
          offset: -40,
          style: {
            textAlign: 'center',
            shadowBlur: 2,
            shadowColor: 'rgba(0, 0, 0, .45)',
            fill: '#fff'
          }
        }) // hover效果
        .tooltip('name*percent', (name, percent) => {
          percent = percent * 100 + '%'
          return {
            name: name,
            value: percent
          }
        })
        .style({
          lineWidth: 1,
          stroke: '#fff'
        })

      chart.interaction('element-single-selected')

      this.chart = chart
      chart.render()

      const chart1 = new Chart({
        container: 'c2',
        autoFit: true,
        height: 500
      })

      chart1.data(this.mydata)

      // console.log ( "aaa",this.mydata[0].countMap.typeCount)

      chart1.scale('typeCounts', {
        nice: true
      })

      chart1.tooltip({
        showMarkers: false
      })

      chart1.interaction('active-region')

      chart1
        .interval()
        .position('name*typeCounts')
        .color('name')

      this.chart1 = chart1
      chart1.render()
    },
    initComponent1() {
      const chart2 = new Chart({
        container: 'c3',
        autoFit: true,
        height: 500
      })

      chart2.data(this.data)

      chart2.scale('count', {
        nice: true
      })

      chart2.tooltip({
        showMarkers: false,
        shared: true // hover时数据一起展示
      })

      chart2
        .interval() // 创建几何标记
        .position('author*count')
        .color('name')
        .adjust([
          {
            type: 'dodge',
            marginRatio: 0
          }
        ])

      chart2.interaction('active-region')

      this.chart2 = chart2
      chart2.render()
    }

  }
}
</script>

<style scoped>
#c2 {
  height: 400px;
  width: 500px;
  margin-left: 100px;
  margin-top: 50px;
  float: left;
}
#c1 {
  height: 400px;
  width: 600px;
  margin-right: 100px;
  margin-top: 30px;
  float: right;
}
#c3 {
  position: relative;
  height: 400px;
  width: 800px;
  margin-left: 20px;
  margin-right: 35px;
  margin-top: 50px;
  float: left;
}
#choose {
  margin-top: 30px;
}
.tips{
  position: absolute;
  margin-left: 1200px;
  margin-top:30px;
}
.mybutton {
  margin-left: 10px;
}
.myspan {
  margin-left: 20px;
  font-family: "微软雅黑";
}
/* #card{
  margin-left: 100px;
} */
/* #c1 {
    float: right
  } */
/* #el-card__body{
    margin-left: 100px;
  } */
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 480px;
}
</style>
