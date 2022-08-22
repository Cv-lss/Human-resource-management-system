import Vue from 'vue'
import Router from 'vue-router'
import approvals from './modules/approvals'
import attendances from './modules/attendances'
import departments from './modules/departments'
import employees from './modules/employees'
import permission from './modules/permission'
import salarys from './modules/salarys'
import setting from './modules/setting'
import social from './modules/social'
Vue.use(Router)
const syncRouter = [approvals, attendances, departments, employees, permission, salarys, setting, social]
/* Layout */
import Layout from '@/layout'

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
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  // ...syncRouter,

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  // 临时合并路由
  routes: [...constantRoutes, ...syncRouter]
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
