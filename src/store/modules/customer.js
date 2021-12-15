const getDefaultState = () => {
  return {
    currentCustomer: null,
    restCustomerList: false,
    contactsInfo: null
  }
}

const state = getDefaultState()

const mutations = {
  SET_CURRENT_CUSTOMER: (state, info) => {
    console.log('info', info)
    state.currentCustomer = info
  },
  SET_REST_CUSTOMER_LIST: (state, rest) => {
    state.restCustomerList = rest
  },
  SET_CONTACTS_INFO: (state, info) => {
    state.contactsInfo = info
  }
}

const actions = {
  setCurrentCustomer ({ commit }, data) {
    commit('SET_CURRENT_CUSTOMER', data)
  },
  setRestCustomerList ({ commit }, data) {
    commit('SET_REST_CUSTOMER_LIST', data)
  },
  setContactsInfo ({ commit }, data) {
    commit('SET_CONTACTS_INFO', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
