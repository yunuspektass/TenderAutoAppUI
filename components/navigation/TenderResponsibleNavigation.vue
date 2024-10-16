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
          İhale Yönetimi
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
        { title: 'Ana Sayfa', icon: 'mdi-home', to: '/tender-responsible/dashboard' },
        { title: 'İhale Yönetimi', icon: 'mdi-gavel', to: '/tender-responsible/tender-management' },
        { title: 'İhalelere Verilen Teklifler', icon: 'mdi-file-eye', to: '/tender-responsible/bid-view' },
        { title: 'İhale Teklif Yönetimi', icon: 'mdi-currency-usd', to: '/tender-responsible/tender-status-update' }
      ]
    }
  },
  mounted () {
    this.drawer = this.$vuetify.breakpoint.mdAndUp
  }
}
</script>
