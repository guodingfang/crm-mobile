// import store from '@/store'
export const setupRouterGuard = (router) => {
  createPageGuard(router)
}

const createPageGuard = (router) => {
  router.beforeEach(async (to, from, next) => {
    // console.log('before to', to, 'before from', from)
    // if (to.path !== '/') {
    //   await store.dispatch('util/setPageLoading', true)
    // }
    next()
  })

  router.afterEach(async (to, from) => {
    // console.log('after to', to, 'after from', from)
    // setTimeout(async () => {
    //   await store.dispatch('util/setPageLoading', false)
    // }, 150)
  })
}
