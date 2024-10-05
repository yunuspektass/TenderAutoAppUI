export const state = () => ({
  offers: []
})

export const mutations = {
  SET_OFFERS (state, offers) {
    state.offers = offers
  },
  ADD_OFFER (state, offer) {
    state.offers.push(offer)
  },
  UPDATE_OFFER (state, updatedOffer) {
    const index = state.offers.findIndex(offer => offer.id === updatedOffer.id)
    if (index !== -1) {
      state.offers.splice(index, 1, updatedOffer)
    }
  },
  DELETE_OFFER (state, offerId) {
    state.offers = state.offers.filter(offer => offer.id !== offerId)
  }
}

export const actions = {
  async fetchOffers ({ commit }) {
    try {
      const response = await this.$axios.get('/api/Offer')
      const offers = response.data.$values || []
      commit('SET_OFFERS', offers)
    } catch (error) {
      console.error('Offer kayıtlarını çekerken hata:', error)
      commit('SET_OFFERS', [])
    }
  },
  async addOffer ({ commit }, offer) {
    try {
      const response = await this.$axios.post('/api/Offer', offer)
      commit('ADD_OFFER', response.data)
    } catch (error) {
      console.error('Offer eklerken hata:', error)
      throw new Error('Teklif eklenirken bir hata oluştu.')
    }
  },
  async updateOffer ({ commit }, offer) {
    try {
      const response = await this.$axios.put(`/api/Offer/${offer.id}`, offer)
      commit('UPDATE_OFFER', response.data)
    } catch (error) {
      console.error('Offer güncellerken hata:', error)
      throw new Error('Teklif güncellenirken bir hata oluştu.')
    }
  },
  async deleteOffer ({ commit }, offerId) {
    try {
      await this.$axios.delete(`/api/Offer/${offerId}`)
      commit('DELETE_OFFER', offerId)
    } catch (error) {
      console.error('Offer silerken hata:', error)
      throw new Error('Teklif silinirken bir hata oluştu.')
    }
  }
}

export const getters = {
  getOffers: state => state.offers,
  getOffersByCompanyId: state => (companyId) => {
    return state.offers.filter(offer => offer.companyId === companyId)
  },
  getOffersByTenderId: state => (tenderId) => {
    return state.offers.filter(offer => offer.tenderId === tenderId)
  }
}
