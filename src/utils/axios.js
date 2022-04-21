// 封装axios的请求，返回重新封装的数据格式
// 对错误的统一处理
import axios from 'axios'
import errorHandle from './errorHandle'

const CancelToken = axios.CancelToken

class HttpRequest {
  constructor (baseURL) {
    this.baseURL = baseURL
    this.pending = {}
  }

  // 获取axios配置
  getInsideConfig (configs) {
    const { baseURL = '', headers = null } = configs
    return {
      baseURL: baseURL || this.baseURL,
      headers: headers || {
        // Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNDU0OCIsImlzcyI6IlJvY0tvbnRyb2wuY29tIiwiZXhwIjoxNjUwNTEwODgyLCJpYXQiOjE2NTA1MDM2ODIsInVzZXJpbmZvIjp7ImNvZGUiOiIzNDU0OCIsIm9yZ05hbWUiOiLkupHpk77lpKfmlbDmja7mioDmnK_pg6giLCJvcmdDb2RlIjoiMDcwMTAxIiwibmFtZSI6IumDreS4geaWuSIsInVzZXJJZCI6IjM0NTQ4IiwidXNlcm5hbWUiOiJndW9kaW5nZmFuZyJ9LCJqdGkiOiIxODA0OWFmOGI3MiJ9.kMtVYgaqyKjLu33DYbem4YtYupMqSBBgNNIpPp6xoA8',
        'Content-Type': 'application/json;charset=utf-8'
      },
      timeout: 10000
    }
  }

  // 取消重复请求
  removePending (key, isRequest = false) {
    if (this.pending[key] && isRequest) {
      this.pending[key]('取消重复请求')
    }
    delete this.pending[key]
  }

  // 设定拦截器
  interceptors (instance) {
    // 添加请求拦截器
    instance.interceptors.request.use((config) => {
      // 在发送请求之前做些什么
      const key = `${config.url}&${config.method}`
      this.removePending(key, true)
      // cancel添加回调函数
      config.cancelToken = new CancelToken((c) => {
        this.pending[key] = c
      })
      return config
    }, (err) => {
      // 对请求错误做些什么
      errorHandle(err)
      return Promise.reject(err)
    })

    // 添加响应拦截器
    instance.interceptors.response.use((res) => {
      const key = `${res.config.url}&${res.config.method}`
      this.removePending(key)
      // 对响应数据做点什么
      if (res.status === 200) {
        return Promise.resolve(res.data)
      } else {
        return Promise.reject(res)
      }
    }, (err) => {
      // 对响应错误做点什么
      errorHandle(err)
      return Promise.reject(err)
    })
  }

  // 创建实例
  request (options, configs) {
    const instance = axios.create()
    const newOptions = Object.assign(this.getInsideConfig(configs), options)
    this.interceptors(instance)
    return instance(newOptions)
  }

  get (url, params, configs = {}) {
    const options = Object.assign({
      method: 'get',
      url
    }, params)
    return this.request(options, configs)
  }

  post (url, data, configs = {}) {
    return this.request({
      method: 'post',
      url,
      data
    }, configs)
  }
}

export default HttpRequest
