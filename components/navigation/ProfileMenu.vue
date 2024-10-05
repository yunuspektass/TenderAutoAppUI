<template>
  <v-menu offset-y>
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" text v-on="on">
        <v-avatar size="40">
          <v-icon size="36">
            mdi-account-circle
          </v-icon>
        </v-avatar>
        <span class="ml-2">
          {{ fullName }}
        </span>
        <v-icon right>
          mdi-menu-down
        </v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item @click="goToProfile">
        <v-list-item-icon>
          <v-icon color="primary">
            mdi-account
          </v-icon>
        </v-list-item-icon>
        <v-list-item-title>Profili Düzenle</v-list-item-title>
      </v-list-item>

      <v-list-item @click="goToNotifications">
        <v-list-item-icon>
          <v-icon color="primary">
            mdi-email
          </v-icon>
          <v-badge
            v-if="unreadNotificationCount > 0"
            color="red"
            content="●"
            overlap
            offset-x="5"
            offset-y="5"
          >
            <v-icon color="primary">
              mdi-email
            </v-icon>
          </v-badge>
        </v-list-item-icon>
        <v-list-item-title>Bildirimler</v-list-item-title>
      </v-list-item>

      <v-list-item @click="logout">
        <v-list-item-icon>
          <v-icon color="primary">
            mdi-logout
          </v-icon>
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
      return `${user.name} ${user.lastName}`
    },
    unreadNotificationCount () {
      return this.$store.getters['notification/getUnreadNotificationCount']
    }

  },
  methods: {
    goToProfile () {
      this.$router.push('/profile-edit')
    },
    goToNotifications () {
      this.$router.push('/notifications')
    },
    logout () {
      this.$auth.logout()
    }
  }
}
</script>
