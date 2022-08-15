import { login } from '@/api/user'
export default {
  namespaced: true,
  state: {
    // token默认是空
    token: null
  },
  mutations: {
    // 修改token
    SETTOKEN(state, token) {
      state.token = token
    }
  },
  actions: {
    // 登录获取token
    async login({ commit }, data) {
      const result = await login(data)
      console.log(result)
      commit('SETTOKEN', result.data.data)
    }
  }
}
