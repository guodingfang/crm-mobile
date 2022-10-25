import {
  getRegionInfo,
  getCustomerCharacter,
  getCustomerType,
  getProjectModel,
  getPreSaleStatus,
  getContactsRol, getVisiType
} from '@/api/util'

const getDefaultState = () => {
  return {
    headerHeight: 0,
    pageLoading: false,
    provinceList: null,
    customerCharacter: null,
    customerType: null,
    projectModel: null,
    preSaleStatus: null,
    contactsRol: null
  }
}

const state = getDefaultState()

const mutations = {
  SET_HEADER_HEIGHT: (state, height) => {
    state.headerHeight = height
  },
  SET_PAGE_LOADING: (state, loading) => {
    state.pageLoading = loading
  },
  SET_PROVINCE_LIST: (state, data) => {
    state.provinceList = data
  },
  SET_CUSTOMER_CHARACTER: (state, data) => {
    state.customerCharacter = data
  },
  SET_CUSTOMER_TYPE: (state, data) => {
    state.customerType = data
  },
  SET_PROJECT_MODEL: (state, data) => {
    state.projectModel = data
  },
  SET_PRE_SALE_STATUS: (state, data) => {
    state.preSaleStatus = data
  },
  SET_CONTACTS_ROL: (state, data) => {
    state.contactsRol = data
  },
  SET_VISI_TYPE: (state, data) => {
    state.visiType = data
  }
}

const actions = {
  setHeaderHeight ({ commit }, height) {
    commit('SET_HEADER_HEIGHT', height)
  },
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
  },
  async setProjectModel ({ commit }) {
    const { code, data } = await getProjectModel()
    if (code === 0) {
      commit('SET_PROJECT_MODEL', data)
      return data
    } else {
      return []
    }
  },
  async setPreSaleStatus ({ commit }) {
    const { code, data } = await getPreSaleStatus()
    const status = data.filter(item => item.dicName === '投标中' || item.dicName === '签单中')
    if (code === 0) {
      commit('SET_PRE_SALE_STATUS', status)
      return status
    } else {
      return []
    }
  },
  async setContactsRol ({ commit }) {
    const { code, data } = await getContactsRol()
    if (code === 0) {
      commit('SET_CONTACTS_ROL', data)
      return data
    } else {
      return []
    }
  },
  async setVisiType ({ commit }) {
    const { code, data } = await getVisiType()
    if (code === 0) {
      commit('SET_VISI_TYPE', data)
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
