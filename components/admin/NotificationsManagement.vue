<template>
  <v-container v-if="!loading" fluid>
    <v-card>
      <v-card-title>
        Bildirim Yönetimi
        <v-spacer />
        <v-btn color="primary" @click="openAddNotificationDialog">
          Yeni Bildirim Ekle
        </v-btn>
      </v-card-title>
      <v-card-subtitle>
        Kullanıcılara bildirim gönderebilir, mevcut bildirimleri düzenleyebilir ve silebilirsiniz.
      </v-card-subtitle>
      <v-data-table
        :headers="headers"
        :items="notifications"
        class="elevation-1"
        item-value="id"
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
        <template #[`item.userName`]="{ item }">
          {{ getUserById(item.userId).name }}
        </template>
        <template #[`item.userLastName`]="{ item }">
          {{ getUserById(item.userId).lastName }}
        </template>
        <template #[`item.userEmail`]="{ item }">
          {{ getUserById(item.userId).email }}
        </template>
        <template #[`item.actions`]="{ item }">
          <v-btn icon color="primary" @click="openEditNotificationDialog(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon color="red" @click="deleteNotification(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>

      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ dialogTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="formValid">
              <v-text-field
                v-model="notification.message"
                label="Bildirim Mesajı"
                :rules="[v => !!v || 'Bildirim mesajı zorunludur']"
                required
              />
              <v-select
                v-model="notification.userId"
                :items="users"
                item-text="fullName"
                item-value="id"
                label="Kullanıcı"
                :rules="[v => !!v || 'Kullanıcı seçilmelidir']"
                required
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" text @click="closeDialog">
              İptal
            </v-btn>
            <v-btn color="blue darken-1" text :disabled="!formValid" @click="saveNotification">
              Kaydet
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
      dialog: false,
      dialogTitle: '',
      formValid: false,
      notification: {
        id: null,
        message: '',
        userId: null
      },
      headers: [
        { text: 'Ad', value: 'userName' },
        { text: 'Soyad', value: 'userLastName' },
        { text: 'E-posta', value: 'userEmail' },
        { text: 'Bildirim Mesajı', value: 'message' },
        { text: 'İşlemler', value: 'actions', sortable: false }
      ]
    }
  },
  computed: {
    notifications () {
      const notifications = this.$store.getters['notification/getNotifications']
      return Array.isArray(notifications) ? notifications : []
    },
    users () {
      return this.$store.getters['user/getUsers'].map(user => ({
        ...user,
        fullName: `${user.name} ${user.lastName}`
      }))
    }
  },
  created () {
    this.initializeData()
  },
  methods: {
    async initializeData () {
      try {
        await this.$store.dispatch('notification/fetchNotifications')
        await this.$store.dispatch('user/fetchUsers')
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error)
      } finally {
        this.loading = false
      }
    },
    getUserById (userId) {
      return this.users.find(user => user.id === userId) || { name: '', lastName: '', email: '' }
    },
    openAddNotificationDialog () {
      this.dialogTitle = 'Yeni Bildirim Ekle'
      this.resetNotificationData()
      this.dialog = true
    },
    openEditNotificationDialog (notification) {
      this.dialogTitle = 'Bildirimi Düzenle'
      this.notification = { ...notification }
      this.dialog = true
    },
    resetNotificationData () {
      this.notification = {
        id: null,
        message: '',
        userId: null
      }
    },
    closeDialog () {
      this.dialog = false
    },
    async saveNotification () {
      if (this.$refs.form.validate()) {
        try {
          if (this.notification.id) {
            await this.$store.dispatch('notification/updateNotification', this.notification)
          } else {
            await this.$store.dispatch('notification/addNotification', this.notification)
          }
          await this.$store.dispatch('notification/fetchNotifications')
        } catch (error) {
          console.error('Bildirim kaydedilirken hata:', error)
        } finally {
          this.closeDialog()
        }
      }
    },
    async deleteNotification (id) {
      try {
        await this.$store.dispatch('notification/deleteNotification', id)
        await this.$store.dispatch('notification/fetchNotifications')
      } catch (error) {
        console.error('Bildirim silinirken hata:', error)
      }
    }
  }
}
</script>
