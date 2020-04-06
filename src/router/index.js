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
    path: '/article',
    component: Layout,
    redirect: '/article/article',
    name: 'Article',
    meta: { title: '文章管理', icon: 'example' },
    children: [
      {
        path: 'type',
        name: 'Type',
        component: () => import('@/views/article/type/type-list'),
        meta: { title: '分类管理', icon: 'table' }
      },
      {
        path: 'article',
        name: 'article',
        component: () => import('@/views/article/article/article-list'),
        meta: { title: '文章管理', icon: 'table' }
      },
      {
        path: 'comment',
        name: 'Comment',
        component: () => import('@/views/article/comment/comment-list'),
        meta: { title: '评论管理', icon: 'table' }
      },
      {
        path: 'collection',
        name: 'Collection',
        component: () => import('@/views/article/collection/collection-list.vue'),
        meta: { title: '收藏管理', icon: 'table' }
      },
      {
        path: 'good',
        name: 'Good',
        component: () => import('@/views/article/good/good-list.vue'),
        meta: { title: '点赞管理', icon: 'table' }
      }
    ]
  },

  {
    path: '/sys',
    component: Layout,
    redirect: '/sys/log',
    name: 'System',
    meta: { title: '系统管理', icon: 'example' },
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
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
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
