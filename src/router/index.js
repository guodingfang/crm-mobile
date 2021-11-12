import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('@/views/home/index'),
    meta: {
      title: 'CRM系统',
      keepAlive: true
    }
  },
  {
    path: '/myClient',
    redirect: '/myClient/list',
    meta: {
      title: '客户列表'
    }
  },
  {
    path: '/myClient/list',
    component: () => import('@/views/my-client/list'),
    meta: {
      title: '客户列表',
      keepAlive: true
    }
  },
  {
    path: '/myClient/details',
    component: () => import('@/views/my-client/details'),
    meta: {
      title: '客户详情'
    }
  },
  {
    path: '/myClient/visitRecord',
    component: () => import('@/views/my-client/visit-record'),
    meta: {
      title: '客户拜访'
    }
  },
  {
    path: '/clientReport',
    redirect: '/clientReport/list',
    meta: {
      title: '客户报备'
    }
  },
  {
    path: '/clientReport/list',
    component: () => import('@/views/client-report/list'),
    meta: {
      title: '客户报备',
      keepAlive: true
    }
  },
  {
    path: '/clientReport/details',
    component: () => import('@/views/client-report/details'),
    meta: {
      title: '客户报备'
    }
  },
  {
    path: '/addContacts',
    component: () => import('@/views/contacts/add-contacts'),
    meta: {
      title: '编辑联系人'
    }
  },
  {
    path: '/clientVisit',
    component: () => import('@/views/client-visit/index'),
    redirect: '/clientVisit/outClock',
    children: [{
      path: 'outClock',
      name: 'VisitOutClock',
      component: () => import('@/views/client-visit/out-clock'),
      meta: {
        title: '客户拜访',
        keepAlive: true
      }
    }, {
      path: 'visitRecord',
      name: 'VisitRecord',
      component: () => import('@/views/client-visit/visit-record'),
      meta: {
        title: '客户拜访',
        keepAlive: true
      }
    }, {
      path: 'details',
      name: 'VisitDetails',
      component: () => import('@/views/client-visit/details'),
      meta: {
        title: '客户拜访'
      }
    }]
  },
  {
    path: '/projectTrack',
    component: () => import('@/views/project-track/index'),
    meta: {
      title: '立项跟踪'
    }
  },
  {
    path: '/projectTrack/list',
    component: () => import('@/views/project-track/list'),
    meta: {
      title: '立项跟踪'
    }
  },
  {
    path: '/projectTrack/details',
    component: () => import('@/views/project-track/details'),
    meta: {
      title: '每周跟踪详情'
    }
  },
  {
    path: '*',
    component: () => import('@/views/exception/404'),
    meta: {
      title: '404'
    }
  }
]
console.log('process.env.BASE_URL', process.env.BASE_URL)
const router = new VueRouter({
  mode: 'hash',
  base: `${window.crmPrefix}/` || '',
  routes
})

export default router
