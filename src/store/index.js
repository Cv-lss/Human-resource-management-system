import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import permission from './modules/permission'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    permission
  },
  getters,
  plugins: [createPersistedState({
    reducer(state) { // 可以指定缓存 具体到摸一个字段
      return {
        user: { // 必须跟state里面的结构一样
          hrsaasTime: state.user.hrsaasTime
        }
      }
    }

  })]

})

export default store
