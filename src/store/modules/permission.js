import router, { syncRouter, constantRoutes } from '@/router'

const state = {
  routes: constantRoutes
}
const mutations = {
  setRoutes(state, matchRoutes) {
    state.routes = [...constantRoutes, ...matchRoutes]
  }
}
const actions = {
  filterRoutes({ commit }, menus) {
    const routes = syncRouter.filter(ele => menus.includes(ele.meta.id))
    commit('setRoutes', routes)
    router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
