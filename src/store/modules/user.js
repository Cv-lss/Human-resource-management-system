import { login } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth' // 引入封装好的本地存储
export default {
  namespaced: true,

  state: {
    // token持久化从本地拿token
    token: getToken()
  },

  mutations: {
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
    }
  }
}
