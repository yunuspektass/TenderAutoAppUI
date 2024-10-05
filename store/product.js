export const state = () => ({
  products: []
})

export const mutations = {
  SET_PRODUCTS (state, products) {
    state.products = Array.isArray(products) ? products : []
  },
  ADD_PRODUCT (state, product) {
    state.products.push(product)
  },
  UPDATE_PRODUCT (state, updatedProduct) {
    const index = state.products.findIndex(product => product.id === updatedProduct.id)
    if (index !== -1) {
      state.products.splice(index, 1, updatedProduct)
    }
  },
  DELETE_PRODUCT (state, productId) {
    state.products = state.products.filter(product => product.id !== productId)
  }
}

export const actions = {
  async fetchProducts ({ commit }) {
    try {
      const response = await this.$axios.get('/api/Product')
      commit('SET_PRODUCTS', response.data.$values)
    } catch (error) {
      console.error('Ürünleri çekerken hata oluştu:', error)
    }
  },
  async addProduct ({ commit }, product) {
    try {
      const response = await this.$axios.post('/api/Product', {
        ...product,
        categoryId: product.category
      })
      commit('ADD_PRODUCT', response.data)
    } catch (error) {
      console.error('Ürün eklerken hata oluştu:', error)
    }
  },
  async updateProduct ({ commit }, product) {
    try {
      const response = await this.$axios.put(`/api/Product/${product.id}`, {
        ...product,
        categoryId: product.category
      })
      commit('UPDATE_PRODUCT', response.data)
    } catch (error) {
      console.error('Ürün güncellerken hata oluştu:', error)
    }
  },
  async deleteProduct ({ commit }, productId) {
    try {
      await this.$axios.delete(`/api/Product/${productId}`)
      commit('DELETE_PRODUCT', productId)
    } catch (error) {
      console.error('Ürün silerken hata oluştu:', error)
    }
  }
}

export const getters = {
  getProducts: state => state.products,
  getProductById: state => (id) => {
    return state.products.find(product => product.id === id) || null
  }
}
