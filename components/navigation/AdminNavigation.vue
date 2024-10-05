<template>
  <v-navigation-drawer app color="indigo" dark>
    <v-list dense>
      <v-subheader class="white--text">
        Yönetim
      </v-subheader>

      <v-list-item to="/admin/dashboard">
        <v-list-item-icon>
          <v-icon>mdi-home</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Ana Sayfa</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/admin/user-management">
        <v-list-item-icon>
          <v-icon>mdi-account-plus</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Kullanıcı Yönetimi</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/admin/tender-management">
        <v-list-item-icon>
          <v-icon>mdi-gavel</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>İhale Yönetimi</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/admin/company-management">
        <v-list-item-icon>
          <v-icon>mdi-domain</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Firma Yönetimi</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/admin/product-management">
        <v-list-item-icon>
          <v-icon>mdi-package-variant-closed</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Ürün Yönetimi</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/admin/bid-view">
        <v-list-item-icon>
          <v-icon>mdi-currency-usd</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Tekliflerin Yönetimi</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/admin/department-management">
        <v-list-item-icon>
          <v-icon>mdi-office-building</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Birim Yönetimi</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/admin/notifications">
        <v-list-item-icon>
          <v-icon>mdi-bell</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Bildirim Gönderme</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/admin/tender-responsible-management">
        <v-list-item-icon>
          <v-icon>mdi-account-tie</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>İhale Sorumlusu Yönetimi</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/admin/company-responsible-management">
        <v-list-item-icon>
          <v-icon>mdi-account-supervisor</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Şirket Sorumlusu Yönetimi</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {}
</script>
