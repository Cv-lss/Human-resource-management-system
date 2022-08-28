
// 批量注册组件
// export default {
//   install(Vue) {
//     Vue.component('PageTools', PageTools)
//   }
// }

// 自动引入组件
// require。context找到同级路径 .vue的 组件
const requireComponent = require.context('./', true, /\.vue$/)
// 里面有个keys方法
const list = requireComponent.keys().map(ele => requireComponent(ele))

export default (Vue) => {
  list.forEach(ele => {
    Vue.component(ele.default.name, ele.default)
  })
}
