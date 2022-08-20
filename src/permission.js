
import router from '@/router'
import store from '@/store'
const whiteList = ['/login', '/404'] // 定义白名单  所有不受权限控制的页面

// 路由前置守卫
router.beforeEach(async(to, from, next) => {
  // 判断里面有没有token
  if (store.getters.token) {
    // 获取用户头像的
    if (!store.state.user.userInfo.userId) {
      await store.dispatch('user/getUserInfo')
    }

    // 如果有token 但是还想去登录界面
    if (to.path === '/login') {
      // 就不跳转 直接在主页面
      next('/')
    } else {
      // 如果没有 就放行
      next()
    }
  } else { // 如果没有token
    // 然后白名单是可以跳转的 login 和404可以跳转
    if (whiteList.includes(to.path)) {
      next()
    } else { // 如果不是去白名单 就到login页
      next('/login') // 跳到登录页
    }
  }
})
