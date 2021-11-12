
const getDefaultState = () => {
  return {
    currentVisit: null,
    clockRecordId: '',
    updateRecord: false
  }
}

const state = getDefaultState()

const mutations = {
  SET_CURRENT_VISIT: (state, info) => {
    state.currentVisit = info
  },
  SET_CLOCK_RECORD_ID: (state, id) => {
    state.clockRecordId = id
  },
  SET_UPDATE_RECORD: (state, isUpdate) => {
    state.updateRecord = isUpdate
  }
}

const actions = {
  setCurrentVisit ({ commit }, data) {
    commit('SET_CURRENT_VISIT', data)
  },
  setClockRecordId ({ commit }, id) {
    commit('SET_CLOCK_RECORD_ID', id)
  },
  setUpdateRecord ({ commit }, isUpdate) {
    commit('SET_UPDATE_RECORD', isUpdate)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
