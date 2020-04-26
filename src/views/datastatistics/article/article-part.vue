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
          <el-select v-model="value" placeholder="请选择" @change="findType">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div id="c3" />
        <div class="tips">
          <el-tooltip content="点击图表下方的字段名将其隐藏以便更好的观察所需数据的情况" placement="bottom" effect="light">
            <el-button>Tips</el-button>
          </el-tooltip>
        </div>
        <el-card class="box-card">
          <h2>文章{{ this.label }}排名</h2>
          <div class="text item">TOP1 {{ data[0].author }}</div>
          <div class="text item">TOP2 {{ data[5].author }}</div>
          <div class="text item">TOP3 {{ data[10].author }}</div>
        </el-card>
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
      articlePercentchart: null,
      articleNumchart: null,
      articleTopchart: null,
      typeparam: {
        sortColumn: 'type_count',
        sortMethod: 'desc'
      },
      topparam: {
        pageSize: 3,
        currentPage: 1,
        sortColumn: 'articleCounts',
        sortMethod: 'desc'
      },
      typeData: [
        { name: 'SpringBoot', count: 30, percent: 0.4 },
        { name: 'Java', count: 21, percent: 0.21 },
        { name: 'C', count: 17, percent: 0.17 },
        { name: 'Python', count: 13, percent: 0.13 },
        { name: 'MySql', count: 9, percent: 0.09 }
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
      options: [
        {
          value: 'articleCounts',
          label: '发表数'
        },
        {
          value: 'goodCounts',
          label: '获赞数'
        },
        {
          value: 'collectionCounts',
          label: '收藏数'
        },
        {
          value: 'commentCounts',
          label: '评论数'
        },
        {
          value: 'readCounts',
          label: '浏览数'
        }
      ],
      value: '发表数',
      label: '发表数'
    }
  },
  watch: {
    typeData(b, a) {
      this.articleNumchart.changeData(b)
      this.articlePercentchart.changeData(b)
      this.articleNumchart.render()
      this.articlePercentchart.render()
    },
    data(b, a) {
      this.articleTopchart.changeData(b)
      this.articleTopchart.render()
    }
  },
  mounted() {
    this.initArticleType()
    this.initArticleTop()
  },
  created() {
    this.getData()
    this.getTopData()
  },

  methods: {
    findType(type) {
      console.log(type)
      let obj = {}
      obj = this.options.find((item) => { // 这里的userList就是上面遍历的数据源
        return item.value === type // 筛选出匹配数据
      })
      console.log(obj.label)
      this.label = obj.label
      this.topparam.sortColumn = type
      this.getTopData()
    },
    getData() {
      typeApi.getArticleTypeCountInfo(this.typeparam).then(res => {
        this.typeData = res.data.list
      })
    },
    getTopData() {
      articleApi.getArticleCountInfo(this.topparam).then(res => {
        console.log('top:', res)
        this.data = []
        for (let i = 0; i < res.data.list.length; i++) {
          var articleCountsData = { name: '发表数', author: res.data.list[i].name, count: res.data.list[i].articleCounts }
          var collectionCountsData = { name: '收藏数', author: res.data.list[i].name, count: res.data.list[i].collectionCounts }
          var commontCountsData = { name: '评论数', author: res.data.list[i].name, count: res.data.list[i].commentCounts }
          var goodCountsData = { name: '获赞数', author: res.data.list[i].name, count: res.data.list[i].goodCounts }
          var readCountsData = { name: '收藏数', author: res.data.list[i].name, count: res.data.list[i].readCounts }
          this.data.push(articleCountsData)
          this.data.push(collectionCountsData)
          this.data.push(commontCountsData)
          this.data.push(goodCountsData)
          this.data.push(readCountsData)
        }
        console.log(this.data)
      })
    },
    handleClick(tab, event) {
      this.articlePercentchart.render()
      this.articleNumchart.render()
      this.articleTopchart.render()
    },
    initArticleType() {
      const articlePercentchart = new Chart({
        container: 'c1',
        autoFit: true,
        height: 400
      })

      articlePercentchart.data(this.typeData)

      // 设置坐标系类型
      articlePercentchart.coordinate('theta', {
        radius: 0.7
      })

      // 设置percent字段显示方式
      articlePercentchart.scale('percent', {
        formatter: val => {
          val = (val * 100).toFixed(2) + '%'
          return val
        }
      })

      articlePercentchart.tooltip({
        showTitle: false,
        showMarkers: false
      })

      // 不显示坐标轴
      articlePercentchart.axis(false)

      const interval = articlePercentchart
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

      articlePercentchart.interaction('element-single-selected')

      this.articlePercentchart = articlePercentchart
      articlePercentchart.render()

      const articleNumchart = new Chart({
        container: 'c2',
        autoFit: true,
        height: 500
      })

      articleNumchart.data(this.typeData)

      articleNumchart.scale('typeCounts', {
        nice: true
      })

      articleNumchart.tooltip({
        showMarkers: false
      })

      articleNumchart.interaction('active-region')

      articleNumchart
        .interval()
        .position('name*typeCounts')
        .color('name')

      this.articleNumchart = articleNumchart
      articleNumchart.render()
    },
    initArticleTop() {
      const articleTopchart = new Chart({
        container: 'c3',
        autoFit: true,
        height: 500
      })

      articleTopchart.data(this.data)

      articleTopchart.scale('count', {
        nice: true
      })

      articleTopchart.tooltip({
        showMarkers: false,
        shared: true // hover时数据一起展示
      })

      articleTopchart
        .interval() // 创建几何标记
        .position('author*count')
        .color('name')
        .adjust([
          {
            type: 'dodge',
            marginRatio: 0
          }
        ])

      articleTopchart.interaction('active-region')

      this.articleTopchart = articleTopchart
      articleTopchart.render()
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
