export const state = () => ({
  userCompanies: []
})

export const mutations = {
  SET_USER_COMPANIES (state, userCompanies) {
    state.userCompanies = userCompanies
  },
  ADD_USER_COMPANY (state, userCompany) {
    state.userCompanies.push(userCompany)
  },
  DELETE_USER_COMPANY (state, userCompanyId) {
    state.userCompanies = state.userCompanies.filter(userCompany => userCompany.id !== userCompanyId)
  }
}

export const actions = {
  async fetchUserCompanies ({ commit }) {
    try {
      const response = await this.$axios.get('/api/UserCompany')
      const userCompanies = response.data.$values || []
      commit('SET_USER_COMPANIES', userCompanies)
    } catch (error) {
      console.error('UserCompany kayıtlarını çekerken hata:', error)
      commit('SET_USER_COMPANIES', [])
    }
  },
  async addUserCompany ({ commit }, userCompany) {
    try {
      const response = await this.$axios.post('/api/UserCompany', userCompany)
      commit('ADD_USER_COMPANY', response.data)
    } catch (error) {
      console.error('UserCompany eklerken hata:', error)
    }
  },
  async deleteUserCompany ({ commit }, userCompanyId) {
    try {
      await this.$axios.delete(`/api/UserCompany/${userCompanyId}`)
      commit('DELETE_USER_COMPANY', userCompanyId)
    } catch (error) {
      console.error('UserCompany silerken hata:', error)
    }
  },
  async removeUserCompaniesByUserId ({ commit }, userId) {
    try {
      await this.$axios.delete(`/api/UserCompany/user/${userId}`)
      commit('SET_USER_COMPANIES', state.userCompanies.filter(userCompany => userCompany.userId !== userId))
    } catch (error) {
      console.error('Kullanıcının şirket sorumluluklarını silerken hata:', error)
    }
  }
}

export const getters = {
  getUserCompanies: state => state.userCompanies,
  getUserCompaniesByCompanyId: state => (companyId) => {
    if (!state.userCompanies || !Array.isArray(state.userCompanies)) {
      return []
    }
    return state.userCompanies.filter(userCompany => userCompany.companyId === companyId)
  },
  getUserCompaniesByUserId: state => (userId) => {
    if (!state.userCompanies || !Array.isArray(state.userCompanies)) {
      return []
    }
    return state.userCompanies.filter(userCompany => userCompany.userId === userId)
  }
}
