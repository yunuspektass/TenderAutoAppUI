export const state = () => ({
  notifications: []
})

export const mutations = {
  SET_NOTIFICATIONS (state, notifications) {
    state.notifications = notifications
  },
  ADD_NOTIFICATION (state, notification) {
    state.notifications.push(notification)
  },
  UPDATE_NOTIFICATION (state, updatedNotification) {
    const index = state.notifications.findIndex(notification => notification.id === updatedNotification.id)
    if (index !== -1) {
      state.notifications[index] = updatedNotification
    }
  },
  DELETE_NOTIFICATION (state, notificationId) {
    state.notifications = state.notifications.filter(notification => notification.id !== notificationId)
  }
}

export const actions = {
  async fetchNotifications ({ commit }) {
    try {
      const response = await this.$axios.get('/api/Notification')
      const notifications = response.data.$values || []
      commit('SET_NOTIFICATIONS', notifications)
    } catch (error) {
      console.error('Bildirimleri çekerken hata:', error)
    }
  },
  async addNotification ({ commit }, notification) {
    try {
      const response = await this.$axios.post('/api/Notification', notification)
      commit('ADD_NOTIFICATION', response.data)
    } catch (error) {
      console.error('Bildirimleri eklerken hata:', error)
    }
  },
  async updateNotification ({ commit }, notification) {
    try {
      const response = await this.$axios.put(`/api/Notification/${notification.id}`, notification)
      commit('UPDATE_NOTIFICATION', response.data)
    } catch (error) {
      console.error('Bildirimi güncellerken hata:', error)
    }
  },
  async deleteNotification ({ commit }, notificationId) {
    try {
      await this.$axios.delete(`/api/Notification/${notificationId}`)
      commit('DELETE_NOTIFICATION', notificationId)
    } catch (error) {
      console.error('Bildirim silerken hata:', error)
    }
  }
}

export const getters = {
  getNotifications: (state) => {
    return state.notifications
  }
}
