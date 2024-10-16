export const state = () => ({
  companyTenders: []
})

export const mutations = {
  SET_COMPANY_TENDERS (state, companyTenders) {
    state.companyTenders = companyTenders
  },
  ADD_COMPANY_TENDER (state, companyTender) {
    state.companyTenders.push(companyTender)
  },
  UPDATE_COMPANY_TENDER (state, updatedCompanyTender) {
    const index = state.companyTenders.findIndex(ct => ct.id === updatedCompanyTender.id)
    if (index !== -1) {
      state.companyTenders.splice(index, 1, updatedCompanyTender)
    }
  },
  DELETE_COMPANY_TENDER (state, companyTenderId) {
    state.companyTenders = state.companyTenders.filter(ct => ct.id !== companyTenderId)
  }
}

export const actions = {
  async fetchCompanyTenders ({ commit }) {
    try {
      const response = await this.$axios.get('/api/CompanyTender')
      const companyTenders = response.data.$values || []
      if (!companyTenders.length) {
        console.warn('CompanyTender verisi boş döndü.')
      }
      commit('SET_COMPANY_TENDERS', companyTenders)
    } catch (error) {
      console.error('CompanyTender kayıtlarını çekerken hata:', error)
      commit('SET_COMPANY_TENDERS', [])
    }
  },
  async addCompanyTender ({ commit }, companyTender) {
    try {
      const response = await this.$axios.post('/api/CompanyTender', companyTender)
      commit('ADD_COMPANY_TENDER', response.data)
    } catch (error) {
      console.error('CompanyTender eklerken hata:', error)
    }
  },
  async updateCompanyTender ({ commit }, companyTender) {
    try {
      const response = await this.$axios.put(`/api/CompanyTender/${companyTender.id}`, companyTender)
      commit('UPDATE_COMPANY_TENDER', response.data)
    } catch (error) {
      console.error('CompanyTender güncellerken hata:', error)
    }
  },
  async deleteCompanyTender ({ commit }, companyTenderId) {
    try {
      await this.$axios.delete(`/api/CompanyTender/${companyTenderId}`)
      commit('DELETE_COMPANY_TENDER', companyTenderId)
    } catch (error) {
      console.error('CompanyTender silerken hata:', error)
    }
  },

  async updateOrCreateCompanyTender ({ commit, state }, companyTender) {
    try {
      let response
      const existingCompanyTender = state.companyTenders.find(
        ct => ct.companyId === companyTender.companyId && ct.tenderId === companyTender.tenderId
      )
      if (existingCompanyTender) {
        response = await this.$axios.put(`/api/CompanyTender/${existingCompanyTender.id}`, companyTender)
      } else {
        response = await this.$axios.post('/api/CompanyTender', companyTender)
      }
      commit('UPDATE_COMPANY_TENDER', response.data)
      return response.data
    } catch (error) {
      console.error('CompanyTender güncellenirken veya oluşturulurken hata:', error)
      if (error.response) {
        console.error('Sunucu yanıtı:', error.response.data)
      }
      throw error
    }
  }
}

export const getters = {
  getCompanyTenders: state => state.companyTenders,
  getCompanyTendersByCompanyId: state => (companyId) => {
    return state.companyTenders.filter(ct => ct.company.id === companyId)
  },
  getCompanyTenderByTenderId: state => (tenderId) => {
    return state.companyTenders.find(ct => ct.tenderId === tenderId)
  },
  getCompanyTenderByTenderAndCompanyId: state => (tenderId, companyId) => {
    return state.companyTenders.find(
      ct => ct.tenderId === tenderId && ct.companyId === companyId
    )
  },
  getCompanyTenderStatsByCompanyId: state => (companyId) => {
    const companyTenders = state.companyTenders.filter(ct => ct.company && ct.company.id === companyId)
    const totalTenders = companyTenders.length
    const wonTenders = companyTenders.filter(ct => ct.awardedAmount > 0).length
    const lostTenders = companyTenders.filter(ct => ct.awardedAmount < 0).length
    return {
      totalTenders,
      wonTenders,
      lostTenders
    }
  }
}
