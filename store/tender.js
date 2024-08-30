export const state = () => ({
  tenders: []
})

export const mutations = {
  SET_TENDERS (state, tenders) {
    state.tenders = tenders
  },
  ADD_TENDER (state, tender) {
    state.tenders.push(tender)
  },
  UPDATE_TENDER (state, updatedTender) {
    const index = state.tenders.findIndex(tender => tender.id === updatedTender.id)
    if (index !== -1) {
      state.tenders[index] = updatedTender
    }
  },
  DELETE_TENDER (state, tenderId) {
    state.tenders = state.tenders.filter(tender => tender.id !== tenderId)
  }
}

export const actions = {
  async fetchTenders ({ commit }) {
    try {
      const response = await this.$axios.get('/api/Tender')
      commit('SET_TENDERS', response.data.$values) // Veriyi Vuex'e kaydederken $values'ı çıkarıyoruz
    } catch (error) {
      console.error('İhaleleri çekerken hata:', error)
    }
  },
  async addTender ({ commit }, tender) {
    try {
      const response = await this.$axios.post('/api/Tender', tender)
      commit('ADD_TENDER', response.data)
    } catch (error) {
      console.error('İhale eklerken hata:', error)
    }
  },
  async updateTender ({ commit }, tender) {
    try {
      const response = await this.$axios.put(`/api/Tender/${tender.id}`, tender)
      commit('UPDATE_TENDER', response.data)
    } catch (error) {
      console.error('İhale güncellerken hata:', error)
    }
  },
  async deleteTender ({ commit }, tenderId) {
    try {
      await this.$axios.delete(`/api/Tender/${tenderId}`)
      commit('DELETE_TENDER', tenderId)
    } catch (error) {
      console.error('İhale silerken hata:', error)
    }
  }
}

export const getters = {
  getTenders: state => state.tenders
}
