import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
Vue.use(Router)

import Layout from '../views/layout/Layout'

export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },
  {
    path: '/worktrack',
    component: Layout,
    redirect: '/worktrack/1',
    name: '工作跟踪管理',
    meta: { title: '工作跟踪管理', icon: 'table' },
    children: [
      {
        path: '1',
        name: '1',
        component: () => import('@/views/worktrack/index'),
        meta: { title: '支部首长' }
      },
      {
        path: '2',
        name: '2',
        component: () => import('@/views/worktrack/index'),
        meta: { title: '参谋部' }
      },
      {
        path: '3',
        name: '3',
        component: () => import('@/views/worktrack/index'),
        meta: { title: '政治工作处' }
      },
      {
        path: '4',
        name: '4',
        component: () => import('@/views/worktrack/index'),
        meta: { title: '保障处' }
      },
      {
        path: '5',
        name: '5',
        component: () => import('@/views/worktrack/index'),
        meta: { title: '大队' }
      },
      {
        path: '6',
        name: '6',
        component: () => import('@/views/worktrack/index'),
        meta: { title: '中队' }
      },
      {
        path: '7',
        name: '7',
        component: () => import('@/views/worktrack/index'),
        meta: { title: '中队-军事' }
      },
      {
        path: '8',
        name: '8',
        component: () => import('@/views/worktrack/index'),
        meta: { title: '中队-政治' }
      },
      {
        path: '9',
        name: '9',
        component: () => import('@/views/worktrack/index'),
        meta: { title: '中队-后勤' }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  { path: '*', redirect: '/404', hidden: true }
]
