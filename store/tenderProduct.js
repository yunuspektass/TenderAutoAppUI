export const state = () => ({
  tenderProducts: []
})

export const mutations = {
  SET_TENDER_PRODUCTS (state, tenderProducts) {
    state.tenderProducts = tenderProducts
  }
}

export const actions = {
  async fetchTenderProducts ({ commit }) {
    try {
      const response = await this.$axios.get('/api/TenderProduct')
      commit('SET_TENDER_PRODUCTS', response.data.$values)
    } catch (error) {
      console.error('TenderProduct kayıtlarını çekerken hata:', error)
    }
  }
}

export const getters = {
  getTenderProductsByTenderId: state => (tenderId) => {
    return state.tenderProducts.filter(product => product.tenderId === tenderId)
  }
}
