export const state = () => ({
  companies: []
})

export const mutations = {
  SET_COMPANIES (state, companies) {
    state.companies = companies
  },
  ADD_COMPANY (state, company) {
    state.companies.push(company)
  },
  UPDATE_COMPANY (state, updatedCompany) {
    const index = state.companies.findIndex(company => company.id === updatedCompany.id)
    if (index !== -1) {
      state.companies.splice(index, 1, updatedCompany)
    }
  },
  DELETE_COMPANY (state, companyId) {
    state.companies = state.compaines.filter(company => company.id !== companyId)
  }
}

export const actions = {
  async fetchCompanies ({ commit }) {
    try {
      const response = await this.$axios.get('/api/Company')
      commit('SET_COMPANIES', response.data.$values)
    } catch (error) {
      console.error('Firmaları çekerken hata oluştu:', error)
    }
  },
  async addCompany ({ commit }, company) {
    try {
      const response = await this.$axios.post('/api/Company', company)
      commit('ADD_COMPANY', response.data)
    } catch (error) {
      console.error('Firma eklerken hata oluştu:', error)
    }
  },
  async updateCompany ({ commit }, company) {
    try {
      const response = await this.$axios.put(`/api/Company/${company.id}`, company)
      commit('UPDATE_COMPANY', response.data)
    } catch (error) {
      console.error('Firma güncellerken hata oluştu:', error)
    }
  },
  async deleteCompany ({ commit }, companyId) {
    try {
      await this.$axios.delete(`/api/Company/${companyId}`)
      commit('DELETE_COMPANY', companyId)
    } catch (error) {
      console.error('Firma silerken hata oluştu:', error)
    }
  }
}

export const getters = {
  getCompanies (state) {
    return state.companies
  }
}
