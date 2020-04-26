<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="报告提交情况" name="first">
        <!-- <div id="c3"></div> -->
        <span class="demonstration">请选择要查看的日期：</span>
        <el-date-picker
          v-model="value"
          align="right"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          @change="findByDate"
        />

        <el-card class="box-card" shadow="always">
          <h3 class="demonstration">{{ this.value === '' ? '今日' : this.value }}报告总体提交情况</h3>
          <div id="c3" />

          <div id="one">
            <el-card class="box-card-one" shadow="always">
              <h4 class="demonstration">提交完成小组</h4>
              <el-tag v-for="groups in finishGroup" :key="groups" type="success" class="mytag"> {{ groups }} </el-tag>
            </el-card>
          </div>

          <div id="two">
            <el-card class="box-card-one" shadow="always">
              <h4 class="demonstration">提交未完成小组</h4>
              <el-tag v-for="groups in unfinishGroup" :key="groups" type="danger" class="mytag"> {{ groups }} </el-tag>
            </el-card>
          </div>
        </el-card>

        <el-card class="box-card" shadow="always">
          <h3 class="demonstration">{{  this.value === '' ? '今日' : this.value }}报告各组提交情况</h3>
          <div id="c1" />
          <div id="c2" />
        </el-card>

        <el-card class="box-card" shadow="always">
          <h3 class="demonstration">近一周报告分数情况</h3>
          <div id="c4" />
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import reportApi from '@/api/report'
import { DataView } from '@antv/data-set'
import G2 from '@antv/g2'
import { Chart } from '@antv/g2'
export default {
  data() {
    return {
      finishGroup: [],
      unfinishGroup: [],
      value: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },   
      classpage: {
        currentPage: 1,
        pageSize: 20,
        params: {
          reportType: 0,
          userClassesId: 1,
          time: ''
        }
      },
      grouppage: {
        currentPage: 1,
        pageSize: 20,
        params: {
          reportType: 0,
          userClassesId: 1,
          isClasses: 0,
          time: ''
        }
      },
      scorepage: {
        pageSize: 20,
        currentPage: 1,
        params: {
          userName: 'test1'
        }
      },
      activeName: 'first',
      groupSubmitChart: null,
      classSubmitChart: null,
      scoreChart: null,
      data: [
        // { type: '第一组', value: 80 },
        // { type: '第二组', value: 90 },
        // { type: '第三组', value: 85 },
        // { type: '第四组', value: 93 },
        // { type: '第五组', value: 85 },
        // { type: '第六组', value: 95 },
        // { type: '第七组', value: 90 }
      ],
      data3: [
        { value: 50, state: '已提交', type: '教师批阅' },
        { value: 10, state: '已提交', type: '班长批阅' },
        { value: 30, state: '已提交', type: '组长批阅' },
        { value: 15, state: '已提交', type: '未批阅' },
        { value: 5, state: '未提交', type: '未提交' }
      ],
      scoredata: [
        // { day: '4-1', name: '平均', score: 7 },
        // { day: '4-1', name: '张三', score: 6 },
        // { day: '4-2', name: '平均', score: 6 },
        // { day: '4-2', name: '张三', score: 7 },
        // { day: '4-3', name: '平均', score: 8 },
        // { day: '4-3', name: '张三', score: 7.5 },
        // { day: '4-4', name: '平均', score: 7.5 },
        // { day: '4-4', name: '张三', score: 8.5 },
        // { day: '4-5', name: '平均', score: 8.5 },
        // { day: '4-5', name: '张三', score: 9 },
        // { day: '4-6', name: '平均', score: 8 },
        // { day: '4-6', name: '张三', score: 8 },
        // { day: '4-7', name: '平均', score: 7.5 },
        // { day: '4-7', name: '张三', score: 6 }
      ]
    }
  },
  watch: {
    data3(b, a) {
      console.log('监听到总体数据', b)
      this.classSubmitChart.changeData(b)
      this.classSubmitChart.render()
    },
    data(b, a) {
      console.log('监听到小组数据', b)
      this.groupSubmitChart.changeData(b)
      this.groupSubmitChart.render()
    },
    scoredata(b, a) {
      this.scoreChart.changeData(b)
      this.scoreChart.render()
    }
  },
  mounted() {
    this.initGroupSubmit()
    this.initClassSubmit()
    this.initScore()
  },
  created() {
    this.findByDate()
    this.getClassData()
    this.getGroupData()
    this.getMarkingScore()
  },
  methods: {
    findByDate() {
      this.classpage.params.time = this.value
      this.grouppage.params.time = this.value
      this.getClassData()
      this.getGroupData()
    },
    getClassData() {
      reportApi
        .getMainReportInfo(this.classpage)
        .then(res => {
          this.data3 = res.data.list
        })
        .catch(error => {
          console.log(error)
        })
    },
    getGroupData() {
      reportApi
        .getUserReportInfo(this.grouppage)
        .then(res => {
          this.finishGroup = []
          this.unfinishGroup = []
          this.data = res.data.list
          for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].value === 100) {
              this.finishGroup.push(this.data[i].type)
            } else {
              this.unfinishGroup.push(this.data[i].type)
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    getMarkingScore() {
      reportApi
        .getMarkingScore(this.scorepage)
        .then(res => {
          this.scoredata = []
          for (let i = 0; i < res.data.list.length; i++) {
            if ((i % 2) === 0) {
              this.scoredata.push(res.data.list[i])
            }
          }
          console.log(this.scoredata)
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleClick(tab, event) {},
    initGroupSubmit() {
      const groupSubmitChart = new Chart({
        container: 'c1',
        autoFit: true,
        height: 300
      })
      groupSubmitChart.data(this.data)
      groupSubmitChart.legend(false)
      groupSubmitChart.tooltip({
        showMarkers: false
      })
      // 分面绘制
      groupSubmitChart.facet('rect', {
        fields: ['type'],
        padding: 20,
        showTitle: false, // 不显示图表上方标题
        eachView: (view, facet) => {
          const data = facet.data
          let color
          // console.log("changdushi",this.data.length)
          if (data[0].type === this.data[0].type) {
            color = '#0a9afe'
          } else if (data[0].type === this.data[1].type) {
            color = 'lightgreen'
          } else if (data[0].type === this.data[2].type) {
            color = 'purple'
          } else if (data[0].type === this.data[3].type) {
            color = '#FFFF99'
          } else if (data[0].type === this.data[4].type) {
            color = '#6666CC'
          } else if (data[0].type === this.data[5].type) {
            color = '#99CC66'
          } else {
            color = '#f0657d'
          }
          data.push({ type: '未提交', value: 100 - data[0].value })
          view.data(data)
          view.coordinate('theta', {
            radius: 0.8,
            innerRadius: 0.5
          })
          view
            .interval()
            .adjust('stack')
            .position('value')
            .color('type', [color, '#eceef1'])
            .style({
              opacity: 1
            })
          // hover
          view.annotation().text({
            position: ['50%', '50%'],
            content: data[0].type,
            style: {
              fontSize: 12,
              fill: '#8c8c8c',
              fontWeight: 300,
              textBaseline: 'bottom',
              textAlign: 'center'
            },
            offsetY: -12
          })
          view.annotation().text({
            position: ['50%', '50%'],
            content: data[0].value + '%',
            style: {
              fontSize: 18,
              fill: '#000',
              fontWeight: 500,
              textAlign: 'center'
            },
            offsetY: 10
          })
          view.interaction('element-active')
        }
      })
      this.groupSubmitChart = groupSubmitChart
      groupSubmitChart.render()
    },
    initClassSubmit() {
      const dv = new DataView()
      dv.source(this.data3).transform({
        type: 'percent',
        field: 'value',
        dimension: 'state',
        as: 'percent'
      })
      const classSubmitChart = new Chart({
        container: 'c3',
        autoFit: true,
        height: 400,
        padding: 0
        // theme: 'dark'
      })
      classSubmitChart.data(dv.rows)
      classSubmitChart.scale({
        percent: {
          formatter: val => {
            val = (val * 100).toFixed(2) + '%'
            return val
          }
        }
      })
      classSubmitChart.coordinate('theta', {
        radius: 0.5
      })
      classSubmitChart.tooltip({
        showTitle: false,
        showMarkers: false
      })
      classSubmitChart.legend(false)
      classSubmitChart
        .interval()
        .adjust('stack')
        .position('percent')
        .color('state')
        .label('state', {
          offset: -10
        })
        .tooltip('type*percent', (item, percent) => {
          percent = (percent * 100).toFixed(2) + '%'
          return {
            name: item,
            value: percent
          }
        })
        .style({
          lineWidth: 1,
          stroke: '#fff'
        })
      const outterView = classSubmitChart.createView()
      const dv1 = new DataView()
      dv1.source(this.data3).transform({
        type: 'percent',
        field: 'value',
        dimension: 'type',
        as: 'percent'
      })
      outterView.data(dv1.rows)
      outterView.scale({
        percent: {
          formatter: val => {
            val = (val * 100).toFixed(2) + '%'
            return val
          }
        }
      })
      outterView.coordinate('theta', {
        innerRadius: 0.5 / 0.75,
        radius: 0.75
      })
      outterView
        .interval()
        .adjust('stack')
        .position('percent')
        .color('type', [
          '#BAE7FF',
          '#7FC9FE',
          '#71E3E3',
          '#ABF5F5',
          '#8EE0A1',
          '#BAF5C4'
        ])
        .label('type')
        .tooltip('type*percent', (item, percent) => {
          percent = (percent * 100).toFixed(2) + '%'
          return {
            name: item,
            value: percent
          }
        })
        .style({
          lineWidth: 1,
          stroke: '#fff'
        })
      classSubmitChart.interaction('element-highlight')
      this.classSubmitChart = classSubmitChart
      classSubmitChart.render()
    },
    initScore() {
      const scoreChart = new Chart({
        container: 'c4',
        autoFit: true,
        height: 400
      })
      scoreChart.data(this.scoredata)
      scoreChart.scale({
        type: {
          range: [0, 1]
        },
        value: {
          min: 0,
          max: 10,
          nice: true
        }
      })
      scoreChart.tooltip({
        showCrosshairs: true,
        shared: true
      })
      scoreChart.axis('value', {
        label: {
          formatter: val => {
            return val
          }
        }
      })
      scoreChart
        .line()
        .position('type*value')
        .color('state')
        .shape('smooth')
      scoreChart
        .point()
        .position('type*value')
        .color('state')
        .shape('circle')
      this.scoreChart = scoreChart
      scoreChart.render()
    }
  }
}
</script>

<style scoped>
#c3 {
  width: 500px;
  float: left;
}
#c4 {
  /* width:800px */
}
#one,
#two {
  margin-left: 30px;
  margin-right: 30px;
  float: left;
}
.box-card {
  margin-top: 20px;
}
.box-card-one {
  width: 300px;
  height: 300px;
}
.demonstration {
  margin-left: 20px;
}
.mytag {
  width: 100px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  font-size: 15px;
  margin: 13px;
}
</style>
