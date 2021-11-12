import { getRegionInfo, getCustomerCharacter, getCustomerType } from '@/api/util'

const getDefaultState = () => {
  return {
    pageLoading: false,
    provinceList: null,
    customerCharacter: null,
    customerType: null
  }
}

const state = getDefaultState()

const mutations = {
  SET_PAGE_LOADING: (state, loading) => {
    state.pageLoading = loading
  },
  SET_PROVINCE_LIST: (state, list) => {
    state.provinceList = list
  },
  SET_CUSTOMER_CHARACTER: (state, list) => {
    state.customerCharacter = list
  },
  SET_CUSTOMER_TYPE: (state, list) => {
    state.customerType = list
  }
}

const actions = {
  setPageLoading ({ commit }, loading) {
    commit('SET_PAGE_LOADING', loading)
  },
  async setProvinceList ({ commit }) {
    const { code, data } = await getRegionInfo({
      regionLevel: 0
    })
    if (code === 0) {
      commit('SET_PROVINCE_LIST', data)
      return data
    } else {
      return []
    }
  },
  async setCustomerCharacter ({ commit }) {
    const { code, data } = await getCustomerCharacter()
    if (code === 0) {
      commit('SET_CUSTOMER_CHARACTER', data)
      return data
    } else {
      return []
    }
  },
  async setCustomerType ({ commit }) {
    const { code, data } = await getCustomerType()
    if (code === 0) {
      commit('SET_CUSTOMER_TYPE', data)
      return data
    } else {
      return []
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
