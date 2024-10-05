export const state = () => ({
  categories: []
})

export const mutations = {
  SET_CATEGORIES (state, categories) {
    state.categories = Array.isArray(categories) ? categories : []
  },
  ADD_CATEGORY (state, category) {
    state.categories.push(category)
  },
  UPDATE_CATEGORY (state, updatedCategory) {
    const index = state.categories.findIndex(category => category.id === updatedCategory.id)
    if (index !== -1) {
      state.categories.splice(index, 1, updatedCategory)
    }
  },
  DELETE_CATEGORY (state, categoryId) {
    state.categories = state.categories.filter(category => category.id !== categoryId)
  }
}

export const actions = {
  async fetchCategories ({ commit }) {
    try {
      const response = await this.$axios.get('/api/Category')
      commit('SET_CATEGORIES', response.data.$values || response.data)
    } catch (error) {
      console.error('Kategoriler çekilirken hata oluştu:', error)
    }
  },
  async addCategory ({ commit }, category) {
    try {
      const response = await this.$axios.post('/api/Category', category)
      commit('ADD_CATEGORY', response.data)
    } catch (error) {
      console.error('Kategori eklenirken hata oluştu:', error)
    }
  },
  async updateCategory ({ commit }, category) {
    try {
      const response = await this.$axios.put(`/api/Category/${category.id}`, category)
      commit('UPDATE_CATEGORY', response.data)
    } catch (error) {
      console.error('Kategori güncellenirken hata oluştu:', error)
    }
  },
  async deleteCategory ({ commit }, categoryId) {
    try {
      await this.$axios.delete(`/api/Category/${categoryId}`)
      commit('DELETE_CATEGORY', categoryId)
    } catch (error) {
      console.error('Kategori silinirken hata oluştu:', error)
    }
  }
}

export const getters = {
  getCategories: state => state.categories
}
