const getDefaultState = () => {
  return {
    currentProject: null
  }
}

const state = getDefaultState()

const mutations = {
  SET_CURRENT_PROJECT: (state, info) => {
    state.currentProject = info
  }
}

const actions = {
  setCurrentProject ({ commit }, data) {
    commit('SET_CURRENT_PROJECT', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
