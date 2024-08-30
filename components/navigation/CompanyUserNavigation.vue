<template>
  <v-navigation-drawer app color="indigo" dark>
    <v-list dense>
      <v-subheader class="white--text">
        Firma İşlemleri
      </v-subheader>

      <v-list-item to="/company/tender-participation">
        <v-list-item-icon>
          <v-icon>mdi-gavel</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>İhalelere Katılma ve Teklif Verme</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/company/bid-view">
        <v-list-item-icon>
          <v-icon>mdi-currency-usd</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Firma Tekliflerinin Görüntülenmesi</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/company/profile-update">
        <v-list-item-icon>
          <v-icon>mdi-account-circle</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Firma Profil Bilgilerinin Güncellenmesi</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/company/won-tenders">
        <v-list-item-icon>
          <v-icon>mdi-trophy</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Kazandığı İhaleler ve Detaylar</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {}
</script>
