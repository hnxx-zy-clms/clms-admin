<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span style="padding: 240px">{{ date }}签到情况</span>
        <span style="color: #8492a6">根据日期查询：</span>
        <el-date-picker v-model="datetime" type="date" placeholder="选择日期" style="margin-right: 20px" value-format="yyyy-MM-dd" />
        <el-button type="success" @click="getRegistrationsByDate(datetime)">查询</el-button>
      </div>
      <lineCharts
        v-if="DestroyIncomeStatistics"
        :id="'chart1'"
        :charData="data"
        style="width: 600px;float: left"
        @getRegistrationName="getRegistrationName"
      />
      <div style="float: right;width: 400px;">
        <span style="padding: 5px">{{ classesTtile }}课签到人员：</span><br>
        <span v-for="(i,k) in name" :key="k" style="color: #67C23A;padding: 5px">{{ i.userName }}</span>
      </div>
    </el-card>
  </div>
</template>

<script>
import registrationApi from '@/api/noticetask/registration'
import lineCharts from '@/views/tasknotice/Registration/lineChart'// g2绘图
export default {
  components: {
    lineCharts
  },
  data() {
    return {
      data: [
        { class: '第一节', num: 0 },
        { class: '第二节', num: 0 },
        { class: '第三节', num: 0 },
        { class: '第四节', num: 0 },
        { class: '第五节', num: 0 }
      ],
      registration: [], // 签到情况
      DestroyIncomeStatistics: false,
      date: 0, // 时间
      datetime: '',
      name: [], // 签到人姓名
      classesTtile: '第一节'
    }
  },
  created() {
    this.date = this.dateFilter()
    this.getRegistrationsByDate(this.date)
  },
  methods: {
    getRegistrationsByDate(date) {
      this.registration = []
      this.data.forEach((item) => {
        item.num = 0
      })
      this.name = []
      this.date = date
      const _this = this
      registrationApi.getRegistrationsByDate(date).then(res => {
        this.registration = res.data
        res.data.forEach((item, index) => {
          for (var i = 0; i < item.signClass.length; i++) {
            var k = item.signClass.substr(i, 1)
            _this.data[k - 1].num = _this.data[k - 1].num + 1
          }
        })
        this.DestroyIncomeStatistics = false
        this.$nextTick(() => {
          this.DestroyIncomeStatistics = true
        })
      })
      this.getRegistrationName('第一节')
    },
    getRegistrationName(classes) { // 获取当节课签到姓名
      this.classesTtile = classes
      if (classes === '第一节') { classes = 1 } else if (classes === '第二节') { classes = 2 } else if (classes === '第三节') { classes = 3 } else if (classes === '第四节') { classes = 4 } else if (classes === '第五节') { classes = 5 }
      registrationApi.getRegistrationName(classes, this.date).then(res => {
        this.name = res.data
      })
    },
    dateFilter() { // 格式化时间
      var d = new Date()
      var year = d.getFullYear()
      var month = d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : '' + (d.getMonth() + 1)
      var day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate()
      return (year + '-' + month + '-' + day)
    }
  }
}
</script>
<style>

</style>
