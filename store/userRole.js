export const state = () => ({
  users: [],
  userRoles: [],
  roleMappings: {
    1: 'Admin',
    2: 'Firma Temsilcisi',
    3: 'İhale Sorumlusu',
    4: 'Genel Kullanıcı'
  }
})

export const mutations = {
  SET_USERS (state, users) {
    state.users = users.$values || users
  },
  SET_USER_ROLES (state, userRoles) {
    state.userRoles = userRoles.$values || userRoles
  }
}

export const actions = {
  async fetchUsers ({ commit }) {
    try {
      const response = await this.$axios.get('/api/User')
      commit('SET_USERS', response.data)
    } catch (error) {
      console.error('Kullanıcıları çekerken hata:', error)
    }
  },
  async fetchUserRoles ({ commit }) {
    try {
      const response = await this.$axios.get('/api/UserRole')
      commit('SET_USER_ROLES', response.data)
    } catch (error) {
      console.error('UserRole verilerini çekerken hata:', error)
    }
  }
}

export const getters = {
  getUsers: state => state.users,
  getUserRolesByUserId: state => (userId) => {
    return state.userRoles.filter(userRole => userRole.userId === userId)
  },
  getRoleNameById: state => (roleId) => {
    return state.roleMappings[roleId] || 'Bilinmeyen Rol'
  },
  getUsersWithRole: state => (roleId) => {
    return state.userRoles
      .filter(userRole => userRole.roleId === roleId)
      .map(userRole => userRole.userId)
  },
  getUserRoles: state => state.userRoles
}
