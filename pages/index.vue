<template>
  <div>
    homepage
    <pre v-text="$store.getters.roles" />

    <pre v-text="$auth.user" />
  </div>
</template>

<script>
export default {
  middleware ({ store, redirect }) {
    if (store.getters.roles.includes('Admin')) {
      return redirect('/admin/dashboard')
    } else if (store.getters.roles.includes('TenderResponsible')) {
      return redirect('/tender-responsible/dashboard')
    } else if (store.getters.roles.includes('CompanyUser')) {
      return redirect('/company/dashboard')
    } else if (store.getters.roles.includes('User')) {
      return redirect('/user/dashboard')
    }
  }
}
</script>
