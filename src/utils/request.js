import store from '@/store'
// import { config } from '@vue/test-utils'
import router from '@/router'
import axios from 'axios'
import { Message } from 'element-ui'

// 判断是不是过期了 token
const timer = 3600
function isCheckout() {
  return (+new Date() - store.getters.hrsaasTime) / 1000 > timer
}

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    // 再有token的时候检查是否过期了
    if (isCheckout()) {
      store.dispatch('user/logout')
      router.push('/login')
      Message.error('token超时')
      return Promise.reject(new Error('接口超时'))
    }
    // 在请求头上带token
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须返回出去config
}, (error) => {
  Message.error(error.message) // 提示错误信息
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use((response) => {
  // 默认返回的是response 这里给他解构了 返回一个data就行了
  const { success, message, data } = response.data

  if (success) {
    return data
  } else {
    Message.error(message) // 提示错误信息
    return Promise.reject(new Error(message))
  }
}, (err) => {
  if (err.response && err.response.data && err.response.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
  } else {
    Message.error(err.message || '') // 提示错误信息
  }

  return Promise.reject(err)
})

export default service
