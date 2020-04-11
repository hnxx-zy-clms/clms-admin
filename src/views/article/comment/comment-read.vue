<template>
  <div>
    <el-card :inline="true" class="article-content-card">
      <div class="comment-content">评论内容:{{ comment.commentContent }}</div>
      <hr style="width=80%">
      <span>评论人:{{ comment.commentUser }}</span>
      <span>评论时间:{{ comment.commentTime }}</span>
      <span>评论量:{{ comment.commentCount }}</span>
      <span>点赞量:{{ comment.commentGood }}</span>

    </el-card>
    <!-- 分割线 -->
    <el-divider />
    <el-card v-for="item in commentList" v-show="comment.commentType == 0 ? true:false" :key="item.commentId">
      <div>评论内容:{{ item.commentContent }}</div>
      <span>评论人:{{ item.commentUser }}</span>
      <span>评论时间:{{ item.commentTime }}</span>
      <span>评论量:{{ item.commentCount }}</span>
      <span>点赞量:{{ item.commentGood }}</span>
    </el-card>
    <el-pagination
      align="center"
      class="pagination"
      :current-page="page.currentPage"
      :page-sizes="[5,10,20,50]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="comment.commentCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import commentApi from '@/api/comment'
export default {

  // 父组件将数据传递给子组件
  props: {
    comment: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      // 定义page对象
      page: {
        currentPage: 1, // 当前页
        pageSize: 5, // 每页显示条数
        totalPage: 0, // 总页数
        totalCount: 0, // 总条数
        params: {
          pid: ''
        }, // 查询参数对象
        list: [], // 数据
        sortColumn: 'commentTime', // 排序列
        sortMethod: 'asc' // 排序方式
      },
      commentList: null
    }
  },
  watch: {
    comment: function() {
      this.getByPage()
    }
  },
  created() {
    this.getByPage()
  },
  methods: {
    // 分页方法 调用封装的方法 getByPage()
    getByPage() {
      console.log(this.comment)
      this.commentList = {}
      const pid = this.comment.commentId
      this.page.params.pid = pid
      commentApi.getByPage(this.page).then(res => {
        this.page = res.data
        this.commentList = res.data.list
      })
    },
    // 每页大小改变 参数 value 为每页大小(pageSize)
    handleSizeChange(val) {
      this.page.pageSize = val
      // 重新请求,刷新页面
      this.getByPage()
    },
    // 当前页跳转 参数 value 当前页(currentPage)
    handleCurrentChange(val) {
      this.page.currentPage = val
      this.getByPage()
    },
    // 修改
    /**
     * 1、父组件可以使用 props 把数据传给子组件。
     * 2、子组件可以使用 $emit 触发父组件的自定义事件
     */
    close() {
      this.$emit('closeUpdateDialog')
    }
  }
}
</script>

<style scoped>
  .article-content-card {
    border: 1px solid black

  }
  .comment-content {
    font-size: 18px
  }

</style>
