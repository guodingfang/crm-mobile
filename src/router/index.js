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
    name: 'myClient',
    redirect: '/myClient/list',
    meta: {
      title: '客户列表'
    }
  },
  {
    path: '/myClient/list',
    name: 'myClientList',
    component: () => import('@/views/my-client/list'),
    meta: {
      title: '客户列表',
      keepAlive: true
    }
  },
  {
    path: '/myClient/details',
    name: 'myClientDetails',
    component: () => import('@/views/my-client/details'),
    meta: {
      title: '客户详情'
    }
  },
  {
    path: '/myClient/visitRecord',
    name: 'myClientVisitRecord',
    component: () => import('@/views/my-client/visit-record'),
    meta: {
      title: '客户拜访'
    }
  },
  {
    path: '/clientReport',
    name: 'clientReport',
    redirect: '/clientReport/list',
    meta: {
      title: '客户报备'
    }
  },
  {
    path: '/clientReport/list',
    name: 'clientReportList',
    component: () => import('@/views/client-report/list'),
    meta: {
      title: '客户报备',
      keepAlive: true
    }
  },
  {
    path: '/clientReport/details',
    name: 'clientReportDetails',
    component: () => import('@/views/client-report/details'),
    meta: {
      title: '客户报备'
    }
  },
  {
    path: '/addContacts',
    name: 'addContacts',
    component: () => import('@/views/contacts/add-contacts'),
    meta: {
      title: '编辑联系人'
    }
  },
  {
    path: '/clientVisit',
    name: 'clientVisit',
    component: () => import('@/views/client-visit/index'),
    redirect: '/clientVisit/outClock',
    children: [{
      path: 'outClock',
      name: 'outClock',
      component: () => import('@/views/client-visit/out-clock'),
      meta: {
        title: '客户拜访',
        keepAlive: true
      }
    }, {
      path: 'visitRecord',
      name: 'visitRecord',
      component: () => import('@/views/client-visit/visit-record'),
      meta: {
        title: '客户拜访',
        keepAlive: true
      }
    }, {
      path: 'details',
      name: 'visitDetails',
      component: () => import('@/views/client-visit/details'),
      meta: {
        title: '客户拜访'
      }
    }]
  },
  {
    path: '/projectTrack',
    name: 'projectTrack',
    component: () => import('@/views/project-track/index'),
    meta: {
      title: '潜在订单'
    }
  },
  {
    path: '/projectTrack/list',
    name: 'projectTrackList',
    component: () => import('@/views/project-track/list'),
    meta: {
      title: '每周进展'
    }
  },
  {
    path: '/projectTrack/details',
    name: 'projectTrackDetails',
    component: () => import('@/views/project-track/details'),
    meta: {
      title: '每周跟踪详情'
    }
  },
  {
    path: '/demo/progress',
    component: () => import('@/views/demo/progress'),
    meta: {
      title: 'demo-进度条'
    }
  },
  {
    path: '/demo/list/:id',
    props: true,
    component: () => import('@/views/demo/list'),
    meta: {
      title: 'demo-列表'
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/exception/404'),
    meta: {
      title: '404'
    }
  },
  {
    path: '*',
    redirect: '/404'
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: `${window.crmPrefix}/` || '',
  routes
})

export default router
