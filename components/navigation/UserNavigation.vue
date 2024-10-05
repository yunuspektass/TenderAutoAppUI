<template>
  <v-navigation-drawer app color="indigo" dark>
    <v-list dense>
      <v-subheader class="white--text">
        Kullanıcı İşlemleri
      </v-subheader>

      <v-list-item to="/user/dashboard">
        <v-list-item-icon>
          <v-icon>mdi-home</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Ana Sayfa</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/user/open-tenders">
        <v-list-item-icon>
          <v-icon>mdi-format-list-bulleted</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Açık İhalelerin Görüntülenmesi</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/user/tender-details">
        <v-list-item-icon>
          <v-icon>mdi-file-eye</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>İhale Detayları ve Sonuçlarının İncelenmesi</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {}
</script>
