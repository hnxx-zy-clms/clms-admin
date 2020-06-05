import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * 1. component: () => import('@/views/login/index') 多路由懒加载
 * 2. redirect 重定向
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/user',
    name: 'User',
    meta: { title: '用户管理', icon: 'user-tool' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/user/user-list'),
        meta: { title: '用户管理', icon: 'user' }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/user/role/index'),
        meta: { title: '角色管理', icon: 'tree' }
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/user/menu/index'),
        meta: { title: '菜单管理', icon: 'table' }
      }
    ]
  },

  {
    path: '/report',
    component: Layout,
    redirect: '/report/report',
    name: 'Report',
    meta: { title: '报告管理', icon: 'report-tool' },
    children: [
      {
        path: 'daily',
        name: 'Daily',
        component: () => import('@/views/report/daily/daliy-list'),
        meta: { title: '日报管理', icon: 'report-day' }
      },
      {
        path: 'weekly',
        name: 'Weekly',
        component: () => import('@/views/report/weekly/weekly-list'),
        meta: { title: '周报管理', icon: 'report-week' }
      },
      {
        path: 'marking',
        name: 'Marking',
        component: () => import('@/views/report/marking/marking-list'),
        meta: { title: '批阅管理', icon: 'report-mark' }
      }
    ]
  },

  {
    path: '/answer',
    component: Layout,
    redirect: '/answer/question',
    name: 'answer',
    meta: { title: '答疑管理', icon: 'answer-tool' },
    children: [
      {
        path: 'question',
        name: 'Question',
        component: () => import('@/views/answer/question/question-list'),
        meta: { title: '问题管理', icon: 'question' }
      },
      {
        path: 'answer',
        name: 'Answer',
        component: () => import('@/views/answer/answer/answer-list'),
        meta: { title: '答复管理', icon: 'answer' }
      }
    ]
  },
  {
    path: '/article',
    component: Layout,
    redirect: '/article/article',
    name: 'article',
    meta: { title: '文章管理', icon: 'article-tool' },
    children: [
      {
        path: 'type',
        name: 'Type',
        component: () => import('@/views/article/type/type-list'),
        meta: { title: '分类管理', icon: 'type' }
      },
      {
        path: 'article',
        name: 'Article',
        component: () => import('@/views/article/article/article-list'),
        meta: { title: '文章管理', icon: 'article' }
      },
      {
        path: 'comment',
        name: 'Comment',
        component: () => import('@/views/article/comment/comment-list'),
        meta: { title: '评论管理', icon: 'comment' }
      },
      {
        path: 'collection',
        name: 'Collection',
        component: () => import('@/views/article/collection/collection-list.vue'),
        meta: { title: '收藏管理', icon: 'collection' }
      },
      {
        path: 'good',
        name: 'Good',
        component: () => import('@/views/article/good/good-list.vue'),
        meta: { title: '点赞管理', icon: 'good' }
      }
    ]
  },
  // 任务通知
  {
    path: '/tasknotice',
    component: Layout,
    name: 'TaskNotice',
    meta: { title: '任务通知', icon: 'task-tool' },
    children: [
      {
        path: 'tasklist',
        name: 'TaskList',
        component: () => import('@/views/tasknotice/task/task-list'),
        meta: { title: '任务管理', icon: 'task-tool' }
      },
      {
        path: 'notice',
        name: 'notice',
        component: () => import('@/views/tasknotice/notice/notice-list'),
        meta: { title: '通知管理', icon: 'notice' }
      },
      {
        path: 'registration',
        name: 'registration',
        component: () => import('@/views/tasknotice/Registration/registration'),
        meta: { title: '签到管理', icon: 'registration' }
      },
      {
        path: 'details',
        name: 'details',
        component: () => import('@/views/tasknotice/task/task-details'),
        hidden: true
      },
      {
        path: 'reply',
        name: 'reply',
        component: () => import('@/views/tasknotice/task/task-reply'),
        hidden: true
      }
    ]
  },
  {
    path: '/classes',
    component: Layout,
    name: 'classes',
    redirect: '/classes/classes',
    meta: { title: '班级管理', icon: 'class-tool' },
    children: [
      {
        path: 'classes',
        name: 'classes',
        component: () => import('@/views/classes/classes/classes-list'),
        meta: { title: '班级', icon: 'class' }
      },
      {
        path: 'college',
        name: 'college',
        component: () => import('@/views/college/college/college-list'),
        meta: { title: '学院', icon: 'school' }
      },
      {
        path: 'group',
        name: 'group',
        component: () => import('@/views/group/group/group-list'),
        meta: { title: '分组', icon: 'group' }
      },
      {
        path: 'position',
        name: 'position',
        component: () => import('@/views/position/position/position-list'),
        meta: { title: '职位', icon: 'position' }
      }
    ]
  },
  {
    path: '/datastatistics',
    component: Layout,
    name: 'DataStatistics',
    meta: { title: '数据统计', icon: 'statistics' },
    children: [
      {
        path: 'reportpart',
        name: 'ReportPart',
        component: () => import('@/views/datastatistics/report/report-part'),
        meta: { title: '报告统计', icon: 'table' }
      },
      {
        path: 'articlepart',
        name: 'ArticlePart',
        component: () => import('@/views/datastatistics/article/article-part'),
        meta: { title: '文章统计', icon: 'table' }
      },
      {
        path: 'test',
        name: 'test',
        component: () => import('@/views/datastatistics/test/city-list'),
        meta: { title: '测试报表', icon: 'table' }
      }
    ]
  },
  {
    path: '/sys',
    component: Layout,
    redirect: '/sys/log',
    name: 'System',
    meta: { title: '系统管理', icon: 'sys-tool' },
    children: [
      {
        path: 'log',
        name: 'Log',
        component: () => import('@/views/sys/log/log-list'),
        meta: { title: '系统日志', icon: 'table' }
      },
      {
        path: 'xxx',
        name: 'Xxx',
        component: () => import('@/views/sys/xxx/xxx-list'),
        meta: { title: '模版', icon: 'table' }
      },
      {
        path: 'druid',
        name: 'Druid',
        component: () => import('@/views/sys/druid/index'),
        meta: { title: 'Druid', icon: 'table' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
