export const state = () => ({})

export const getters = {
  roles: (state, getters, rootState) => {
    if (!rootState.auth.user) {
      return []
    }
    return rootState.auth.user.roles.$values.map(r => r.roleName)
  }
}
