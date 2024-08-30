export default function ({ store, redirect }) {
  if (!store.state.roles.includes('TenderResponsible')) {
    return redirect('/')
  }
}
