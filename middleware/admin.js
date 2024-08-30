export default function ({ store, redirect }) {
  if (!store.getters.roles.includes('Admin')) {
    return redirect('/')
  }
}
