import Vue from 'vue'
import VConsole from 'vconsole'
import App from './App.vue'
import router from './router'
import store from './store'
import { setupRouterGuard } from '@/router/guard'

// import 'normalize.css'
import '@/icons' // 引入 svg icon
import '@/utils/resize' // 监听浏览器窗口变化设置字体大小（rem）
import '@/styles/index.less'

if (process.env.NODE_ENV !== 'development') {
  const vConsole = new VConsole()
  Vue.use(vConsole)
}

Vue.config.productionTip = false

setupRouterGuard(router)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
