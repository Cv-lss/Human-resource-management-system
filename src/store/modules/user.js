import { login, getUserInfo } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth' // 引入封装好的本地存储
export default {
  namespaced: true,

  state: {
    // token持久化从本地拿token
    token: getToken(),
    // 用户信息
    userInfo: {}
  },

  mutations: {
    // 把获取到的用户信息给state
    SETUSERINFO(state, userInfo) {
      state.userInfo = JSON.parse(JSON.stringify(userInfo)) // 这边拿到的是复杂类型的地址 用深拷贝
    },
    // 清空用户信息
    removeUserInfo(state) {
      state.userInfo = {}
    },
    // 修改token
    SETTOKEN(state, token) {
      state.token = token
      // 把token存到本地存储
      setToken(token)
    },
    // 清空token
    removeToken(state) {
      state.token = null
      removeToken()
    }
  },

  actions: {
    // 登录获取token
    async login({ commit }, data) {
      const result = await login(data)
      console.log(result)
      commit('SETTOKEN', result)
    },
    // 获取用户信息
    async   getUserInfo({ commit }) {
      const res = await getUserInfo()
      console.log(res)
      commit('SETUSERINFO', res)
      return res // 这里如果返回出去了 会有一个问题
    }
  }
}
