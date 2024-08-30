<template>
  <v-card>
    <v-card-title>
      İhale Sorumlusu Yönetimi
      <v-spacer />
      <v-btn color="primary" @click="openAddResponsibleDialog">
        Yeni İhale Sorumlusu Ekle
      </v-btn>
    </v-card-title>
    <v-card-subtitle>
      İhale sorumlusu ekleyebilir, düzenleyebilir ve çıkarabilirsiniz.
    </v-card-subtitle>
    <v-data-table
      :headers="headers"
      :items="tenderResponsibleUsers"
      class="elevation-1"
      item-value="id"
    >
      <template #[`item.tenders`]="{ item }">
        <v-expansion-panels flat>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Sorumlu Olduğu İhaleler
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div v-for="tender in getTendersByUserId(item.id)" :key="tender.id">
                {{ tender.title }}
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-btn icon color="primary" @click="openEditResponsibleDialog(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon color="red" @click="deleteResponsible(item.id)">
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
            <v-select
              v-if="!isEditMode"
              v-model="selectedUserId"
              :items="availableUsers"
              item-text="fullName"
              item-value="id"
              label="Kullanıcı Seç"
              :rules="[v => !!v || 'Kullanıcı seçilmelidir']"
              required
            />
            <v-select
              v-model="selectedTenderIds"
              :items="tenders"
              item-text="title"
              item-value="id"
              label="İhaleleri Seç"
              :rules="[v => !!v || 'En az bir ihale seçilmelidir']"
              multiple
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="closeDialog">
            İptal
          </v-btn>
          <v-btn color="blue darken-1" text :disabled="!formValid" @click="saveResponsible">
            Kaydet
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  data () {
    return {
      dialog: false,
      dialogTitle: '',
      formValid: false,
      selectedUserId: null,
      selectedTenderIds: [],
      isEditMode: false,
      headers: [
        { text: 'Ad', value: 'name' },
        { text: 'Soyad', value: 'lastName' },
        { text: 'Sorumlu Olduğu İhaleler', value: 'tenders', sortable: false },
        { text: 'İşlemler', value: 'actions', sortable: false }
      ]
    }
  },
  computed: {
    tenderResponsibleUsers () {
      return this.$store.getters['user/getUsers'].filter(user =>
        this.$store.getters['userRole/getUserRolesByUserId'](user.id).some(role => role.roleId === 3)
      )
    },
    users () {
      return this.$store.getters['user/getUsers']
    },
    availableUsers () {
      const responsibleUserIds = this.tenderResponsibleUsers.map(user => user.id)
      return this.users
        .filter(user => !responsibleUserIds.includes(user.id))
        .map(user => ({
          id: user.id,
          fullName: `${user.name} ${user.lastName}`
        }))
    },
    tenders () {
      return this.$store.getters['tender/getTenders']
    },
    userTenders () {
      return this.$store.getters['userTender/getUserTenders']
    }
  },
  created () {
    this.$store.dispatch('user/fetchUsers')
    this.$store.dispatch('userRole/fetchUserRoles')
    this.$store.dispatch('tender/fetchTenders')
    this.$store.dispatch('userTender/fetchUserTenders')
  },
  methods: {
    openAddResponsibleDialog () {
      this.dialogTitle = 'Yeni İhale Sorumlusu Ekle'
      this.selectedUserId = null
      this.selectedTenderIds = []
      this.isEditMode = false
      this.dialog = true
    },
    openEditResponsibleDialog (responsible) {
      this.dialogTitle = 'İhale Sorumlusunu Düzenle'
      this.selectedUserId = responsible.id
      this.selectedTenderIds = this.getTendersByUserId(responsible.id).map(tender => tender.id)
      this.isEditMode = true
      this.dialog = true
    },
    closeDialog () {
      this.dialog = false
    },
    async saveResponsible () {
      if (this.$refs.form.validate()) {
        if (this.isEditMode) {
          if (this.selectedTenderIds.length > 0) {
            await this.$store.dispatch('userTender/removeUserTendersByUserId', this.selectedUserId)

            for (const tenderId of this.selectedTenderIds) {
              const userTender = {
                userId: this.selectedUserId,
                tenderId
              }
              await this.$store.dispatch('userTender/addUserTender', userTender)
            }
            await this.fetchUpdatedData()
          }
        } else if (this.selectedUserId && this.selectedTenderIds.length > 0) {
          const updatedUser = this.users.find(user => user.id === this.selectedUserId)
          if (updatedUser) {
            updatedUser.roleIds = [3]
            await this.$store.dispatch('user/updateUser', updatedUser)

            for (const tenderId of this.selectedTenderIds) {
              const userTender = {
                userId: this.selectedUserId,
                tenderId
              }
              await this.$store.dispatch('userTender/addUserTender', userTender)
            }
            await this.fetchUpdatedData()
          }
        }
        this.closeDialog()
      }
    },
    async deleteResponsible (id) {
      await this.$store.dispatch('user/deleteUser', id)
    },
    getTendersByUserId (userId) {
      const userTenders = this.$store.getters['userTender/getUserTendersByUserId'](userId)
      return userTenders.map(ut => this.tenders.find(tender => tender.id === ut.tenderId))
    },
    async fetchUpdatedData () {
      await this.$store.dispatch('user/fetchUsers')
      await this.$store.dispatch('userRole/fetchUserRoles')
      await this.$store.dispatch('userTender/fetchUserTenders')
    }
  }
}
</script>
