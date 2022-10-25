import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import getters from './getters'
import user from './modules/user'
import customer from './modules/customer'
import util from './modules/util'
import visit from './modules/visit'
import week from './modules/week'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  modules: ['user', 'customer', 'visit', 'util', 'week']
})

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    customer,
    util,
    visit,
    week
  },
  getters,
  plugins: [vuexLocal.plugin]
})
