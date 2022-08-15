import axios from 'axios'
import { Message } from 'element-ui'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use()

// 响应拦截器
service.interceptors.response.use((response) => {
  // 默认返回的是response 这里给他结构了 返回一个data就行了
  const { success, message, data } = response.data

  if (success) {
    return data
  } else {
    Message.error(message) // 提示错误信息
    return Promise.reject(new Error(message))
  }
}, (error) => {
  Message.error(error.message) // 提示错误信息
  return Promise.reject(error)
})

export default service
