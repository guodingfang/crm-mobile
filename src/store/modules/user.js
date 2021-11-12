const getDefaultState = () => {
  return {
    userInfo: null
  }
}

const state = getDefaultState()

const mutations = {
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  setUserInfo ({ commit }, data) {
    commit('SET_USERINFO', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
