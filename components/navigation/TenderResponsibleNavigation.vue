<template>
  <v-navigation-drawer app color="indigo" dark>
    <v-list dense>
      <v-subheader class="white--text">
        İhale Yönetimi
      </v-subheader>

      <v-list-item to="/tender-responsible/dashboard">
        <v-list-item-icon>
          <v-icon>mdi-home</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Ana Sayfa</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/tender-responsible/tender-management">
        <v-list-item-icon>
          <v-icon>mdi-gavel</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>İhale Yönetimi</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/tender-responsible/bid-view">
        <v-list-item-icon>
          <v-icon>mdi-file-eye</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>İhalelere Verilen Teklifler</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/tender-responsible/tender-status-update">
        <v-list-item-icon>
          <v-icon>mdi-currency-usd</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>İhale Teklif Yönetimi</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {}
</script>
