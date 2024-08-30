export const state = () => ({
  userTenders: []
})

export const mutations = {
  SET_USER_TENDERS (state, userTenders) {
    state.userTenders = userTenders
  },
  ADD_USER_TENDER (state, userTender) {
    state.userTenders.push(userTender)
  },
  DELETE_USER_TENDER (state, userTenderId) {
    state.userTenders = state.userTenders.filter(userTender => userTender.id !== userTenderId)
  }
}

export const actions = {
  async fetchUserTenders ({ commit }) {
    try {
      const response = await this.$axios.get('/api/UserTender')
      const userTenders = response.data.$values || []
      commit('SET_USER_TENDERS', userTenders)
    } catch (error) {
      console.error('UserTender kayıtlarını çekerken hata:', error)
    }
  },
  async addUserTender ({ commit }, userTender) {
    try {
      const response = await this.$axios.post('/api/UserTender', userTender)
      commit('ADD_USER_TENDER', response.data)
    } catch (error) {
      console.error('UserTender eklerken hata:', error)
    }
  },
  async deleteUserTender ({ commit }, userTenderId) {
    try {
      await this.$axios.delete(`/api/UserTender/${userTenderId}`)
      commit('DELETE_USER_TENDER', userTenderId)
    } catch (error) {
      console.error('UserTender silerken hata:', error)
    }
  },
  async removeUserTendersByUserId ({ commit, state }, userId) {
    try {
      await this.$axios.delete(`/api/UserTender/user/${userId}`)

      commit('SET_USER_TENDERS', state.userTenders.filter(userTender => userTender.userId !== userId))
    } catch (error) {
      console.error('Kullanıcının ihale sorumluluklarını silerken hata:', error)
    }
  }
}

export const getters = {
  getUserTenders: state => state.userTenders,
  getUserTendersByTenderId: state => (tenderId) => {
    if (!state.userTenders || !Array.isArray(state.userTenders)) { return [] }
    return state.userTenders.filter(userTender => userTender.tenderId === tenderId)
  },
  getUserTendersByUserId: state => (userId) => {
    if (!state.userTenders || !Array.isArray(state.userTenders)) { return [] }
    return state.userTenders.filter(userTender => userTender.userId === userId)
  }

}
