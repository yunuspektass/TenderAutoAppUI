export const state = () => ({
  units: []
})

export const mutations = {
  SET_UNITS (state, units) {
    state.units = units
  },
  ADD_UNIT (state, unit) {
    state.units.push(unit)
  },
  UPDATE_UNIT (state, updatedUnit) {
    const index = state.units.findIndex(unit => unit.id === updatedUnit.id)
    if (index !== -1) {
      state.units[index] = updatedUnit
    }
  },
  DELETE_UNIT (state, unitId) {
    state.units = state.units.filter(unit => unit.id !== unitId)
  }
}

export const actions = {
  async fetchUnits ({ commit }) {
    try {
      const response = await this.$axios.get('/api/Unit')
      const units = response.data.$values.map(unit => ({
        id: unit.id,
        unitName: unit.unitName,
        tenders: unit.tenders ? unit.tenders.$values : [], // Eğer tenders undefined ise boş dizi atar
        users: unit.users ? unit.users.$values : [] // Eğer users undefined ise boş dizi atar
      }))
      commit('SET_UNITS', units)
    } catch (error) {
      console.error('Üniteleri çekerken hata oluştu:', error)
    }
  },
  async addUnit ({ commit }, unit) {
    try {
      const response = await this.$axios.post('/api/Unit', unit)
      commit('ADD_UNIT', response.data)
    } catch (error) {
      console.error('Unit eklerken hata:', error)
    }
  },
  async updateUnit ({ commit }, unit) {
    try {
      const response = await this.$axios.put(`/api/Unit/${unit.id}`, unit)
      commit('UPDATE_UNIT', response.data)
    } catch (error) {
      console.error('Unit güncellerken hata:', error)
    }
  },
  async deleteUnit ({ commit }, unitId) {
    try {
      await this.$axios.delete(`/api/Unit/${unitId}`)
      commit('DELETE_UNIT', unitId)
    } catch (error) {
      console.error('Unit silerken hata:', error)
    }
  }
}

export const getters = {
  getUnits: state => state.units
}
