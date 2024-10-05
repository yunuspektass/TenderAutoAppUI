<template>
  <v-container v-if="!loading" fluid>
    <v-card>
      <v-card-title>Bildirimler</v-card-title>
      <v-data-table
        :headers="headers"
        :items="notifications"
        class="elevation-1"
      >
        <template #[`item.message`]="{ item }">
          <v-expansion-panels flat>
            <v-expansion-panel>
              <v-expansion-panel-header>
                {{ item.message.substring(0, 30) }}...
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                {{ item.message }}
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-btn icon color="primary" @click="markAsRead(item.id)">
            <v-icon v-if="!item.isRead">
              mdi-check
            </v-icon>
            <v-icon v-else>
              mdi-eye-check-outline
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>

  <v-container v-else fluid class="d-flex align-center justify-center" style="height: 100vh">
    <v-row align="center" justify="center">
      <v-progress-circular indeterminate color="primary" />
    </v-row>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      loading: true,
      headers: [
        { text: 'Mesaj', value: 'message' },
        { text: 'İşlemler', value: 'actions', sortable: false }
      ]
    }
  },
  computed: {
    notifications () {
      return this.$store.getters['notification/getNotificationsForUser'](this.$auth.user.id)
    }
  },
  async created () {
    await this.loadData()
  },
  methods: {
    async loadData () {
      try {
        await this.$store.dispatch('notification/fetchNotifications')
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error)
      } finally {
        this.loading = false
      }
    },
    async markAsRead (notificationId) {
      try {
        await this.$store.dispatch('notification/markAsRead', notificationId)
        await this.loadData()
      } catch (error) {
        console.error('Bildirim okunurken hata oluştu:', error)
      }
    }
  }
}
</script>
