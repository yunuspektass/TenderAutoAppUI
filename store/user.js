export const state = () => ({
  userInfo: {},
  users: [],
  roles: []
})

export const mutations = {
  SET_USERS (state, users) {
    state.users = (Array.isArray(users.$values) ? users.$values : users).map(user => ({
      ...user,
      roles: user.roles ? Array.isArray(user.roles.$values) ? user.roles.$values : user.roles : []
    }))
  },
  SET_ROLES (state, roles) {
    state.roles = Array.isArray(roles.$values) ? roles.$values : roles
  },
  ADD_USER (state, user) {
    state.users.push(user)
  },
  UPDATE_USER (state, updatedUser) {
    const index = state.users.findIndex(user => user.id === updatedUser.id)
    if (index !== -1) {
      state.users.splice(index, 1, {
        ...updatedUser,
        roles: updatedUser.roles ? Array.isArray(updatedUser.roles) ? updatedUser.roles : updatedUser.roles.$values : []
      })
    }
  },
  DELETE_USER (state, userId) {
    state.users = state.users.filter(user => user.id !== userId)
  }
}

export const actions = {
  async fetchUsers ({ commit }) {
    try {
      const response = await this.$axios.get('/api/User')
      const users = response.data.$values || []
      commit('SET_USERS', users)
    } catch (error) {
      console.error('Kullanıcıları çekerken hata:', error)
    }
  },
  async fetchRoles ({ commit }) {
    try {
      const response = await this.$axios.get('/api/Role')
      const roles = response.data.$values || []
      commit('SET_ROLES', roles)
    } catch (error) {
      console.error('Rolleri çekerken hata:', error)
    }
  },
  async addUser ({ commit }, user) {
    try {
      const response = await this.$axios.post('/api/User', user)
      commit('ADD_USER', response.data)
    } catch (error) {
      console.error('Kullanıcı eklerken hata:', error)
    }
  },
  async updateUser ({ commit }, user) {
    try {
      const response = await this.$axios.put(`/api/User/${user.id}`, user)
      commit('UPDATE_USER', response.data)
    } catch (error) {
      console.error('Kullanıcı güncellerken hata:', error)
    }
  },
  async deleteUser ({ commit }, userId) {
    try {
      await this.$axios.delete(`/api/User/${userId}`)
      commit('DELETE_USER', userId)
    } catch (error) {
      console.error('Kullanıcı silerken hata:', error)
    }
  }
}

export const getters = {
  getUsers: (state) => {
    return state.users
  },
  getRoles: (state) => {
    return state.roles
  },
  getTenderResponsibleUsers: (state) => {
    return state.users.filter((user) => {
      return user.roles && user.roles.$values.some(role =>
        role.userRoles && role.userRoles.$values.some(userRole => userRole.roleId === 3)
      )
    })
  }
}
