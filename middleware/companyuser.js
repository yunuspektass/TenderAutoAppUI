export default function ({ store, redirect }) {
  if (!store.state.roles.includes('CompanyUser')) {
    return redirect('/')
  }
}
