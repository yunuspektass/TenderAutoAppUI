export const state = () => ({
  companyTenders: []
})

export const mutations = {
  SET_COMPANY_TENDERS(state, companyTenders) {
    state.companyTenders = companyTenders
  }
}

export const actions = {
  async fetchCompanyTenders({ commit }) {
    try {
        const response = await this.$axios.get('/api/CompanyTender')
        commit('SET_COMPANY_TENDERS', response.data.$values)
      }catch (error){
        console.error('Firma ihalelerini çekerken hata oluştu:', error)
      }
    }
  }

  export const getters = {
    getCompanyTenders(state) {
      return state.companyTenders
    }
  }


