<template>
  <div>
    <v-navigation-drawer
      app
      color="indigo"
      dark
      :permanent="$vuetify.breakpoint.mdAndUp"
      :temporary="$vuetify.breakpoint.smAndDown"
      v-model="drawer"
    >
      <v-list dense>
        <v-subheader class="white--text">
          Yönetim
        </v-subheader>

        <v-list-item v-for="item in menuItems" :key="item.title" :to="item.to">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar-nav-icon
      @click.stop="drawer = !drawer"
      class="d-md-none white--text"
      style="position: fixed; top: 8px; left: 8px; z-index: 1000;"
      v-show="!drawer"
    >
      <v-icon color="white">mdi-menu</v-icon>
    </v-app-bar-nav-icon>
  </div>
</template>

<script>
export default {
  data () {
    return {
      drawer: null,
      menuItems: [
        { title: 'Ana Sayfa', icon: 'mdi-home', to: '/admin/dashboard' },
        { title: 'Kullanıcı Yönetimi', icon: 'mdi-account-plus', to: '/admin/user-management' },
        { title: 'İhale Yönetimi', icon: 'mdi-gavel', to: '/admin/tender-management' },
        { title: 'Firma Yönetimi', icon: 'mdi-domain', to: '/admin/company-management' },
        { title: 'Ürün Yönetimi', icon: 'mdi-package-variant-closed', to: '/admin/product-management' },
        { title: 'Tekliflerin Yönetimi', icon: 'mdi-currency-usd', to: '/admin/bid-view' },
        { title: 'Birim Yönetimi', icon: 'mdi-office-building', to: '/admin/department-management' },
        { title: 'Bildirim Gönderme', icon: 'mdi-bell', to: '/admin/notifications' },
        { title: 'İhale Sorumlusu Yönetimi', icon: 'mdi-account-tie', to: '/admin/tender-responsible-management' },
        { title: 'Şirket Sorumlusu Yönetimi', icon: 'mdi-account-supervisor', to: '/admin/company-responsible-management' }
      ]
    }
  },
  mounted () {
    this.drawer = this.$vuetify.breakpoint.mdAndUp
  }
}
</script>
