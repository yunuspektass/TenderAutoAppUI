<template>
  <v-navigation-drawer app color="indigo" dark>
    <v-list dense>
      <v-subheader class="white--text">
        Firma İşlemleri
      </v-subheader>

      <v-list-item to="/company/dashboard">
        <v-list-item-icon>
          <v-icon>mdi-home</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Ana Sayfa</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/company/tender-participation">
        <v-list-item-icon>
          <v-icon>mdi-gavel</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>İhale Teklif Yönetimi</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/company/profile-update">
        <v-list-item-icon>
          <v-icon>mdi-account-circle</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Firma Profil Yönetimi</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/company/won-tenders">
        <v-list-item-icon>
          <v-icon>mdi-trophy</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>İhale ve Şirket Detayları</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {}
</script>
