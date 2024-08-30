<template>
  <v-menu offset-y>
    <template #activator="{ on,attrs }">
      <v-btn v-bind="attrs" icon v-on="on">
        <v-avatar size="40">
          <v-icon size="36">
            mdi-account-circle
          </v-icon>
        </v-avatar>
      </v-btn>
    </template>

    <v-list>
      <v-list-item @click="goToProfile">
        <v-list-item-icon>
          <v-icon>mdi-account</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Profili Düzenle</v-list-item-title>
      </v-list-item>

      <v-list-item @click="logout">
        <v-list-item-icon>
          <v-icon>mdi-logout</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Çıkış Yap</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  computed: {
    fullName () {
      const user = this.$auth.user
      return `${user.firstName} ${user.lastName}`
    }
  },
  methods: {
    goToProfile () {
      this.$router.push('/profile')
    },
    logout () {
      this.$auth.logout()
    }
  }
}
</script>
