import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import getters from './getters'
import user from './modules/user'
import customer from './modules/customer'
import util from './modules/util'
import visit from './modules/visit'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  modules: ['user', 'customer', 'visit']
})

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    customer,
    util,
    visit
  },
  getters,
  plugins: [vuexLocal.plugin]
})
