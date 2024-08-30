export default function ({ store, redirect }) {
  if (!store.state.roles.includes('User')) {
    return redirect('/')
  }
}
