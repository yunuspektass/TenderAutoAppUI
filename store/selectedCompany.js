export const state = () => ({
  selectedCompanyId: null
})

export const mutations = {
  SET_SELECTED_COMPANY_ID (state, id) {
    state.selectedCompanyId = id
  }
}

export const actions = {
  setSelectedCompanyId ({ commit }, id) {
    commit('SET_SELECTED_COMPANY_ID', id)
  }
}

export const getters = {
  getSelectedCompanyId: state => state.selectedCompanyId
}
