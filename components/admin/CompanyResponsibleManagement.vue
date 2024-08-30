<template>
  <v-card>
    <v-card-title>
      Şirket Sorumlusu Yönetimi
      <v-spacer />
      <v-btn color="primary" @click="openAddAssignmentDialog">
        Yeni Şirket Sorumlusu Ekle
      </v-btn>
    </v-card-title>
    <v-card-subtitle>
      Şirket sorumlusu ekleyebilir, düzenleyebilir ve çıkarabilirsiniz.
    </v-card-subtitle>
    <v-data-table
      :headers="headers"
      :items="companyUsers"
      class="elevation-1"
      item-value="id"
    >
      <template #[`item.companies`]="{ item }">
        <v-expansion-panels flat>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Sorumlu Olduğu Şirketler
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div v-for="company in getCompaniesByUserId(item.id)" :key="company.id">
                {{ company.companyName }}
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-btn icon color="primary" @click="openEditAssignmentDialog(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon color="red" @click="deleteAssignment(item.id)">
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
              :items="allUsers"
              item-text="fullName"
              item-value="id"
              label="Kullanıcı Seç"
              :rules="[v => !!v || 'Kullanıcı seçilmelidir']"
              required
            />
            <v-select
              v-model="selectedCompanyIds"
              :items="companies"
              item-text="companyName"
              item-value="id"
              label="Şirketleri Seç"
              :rules="[v => !!v || 'En az bir şirket seçilmelidir']"
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
          <v-btn color="blue darken-1" text :disabled="!formValid" @click="saveAssignment">
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
      selectedCompanyIds: [],
      isEditMode: false,
      headers: [
        { text: 'Ad', value: 'name' },
        { text: 'Soyad', value: 'lastName' },
        { text: 'Sorumlu Olduğu Şirketler', value: 'companies', sortable: false },
        { text: 'İşlemler', value: 'actions', sortable: false }
      ]
    }
  },
  computed: {
    companyUsers () {
      return this.$store.getters['user/getUsers'].filter(user =>
        this.$store.getters['userRole/getUserRolesByUserId'](user.id).some(role => role.roleId === 2)
      )
    },
    users () {
      return this.$store.getters['user/getUsers']
    },
    allUsers () {
      return this.users.map(user => ({
        id: user.id,
        fullName: `${user.name} ${user.lastName}`
      }))
    },
    companies () {
      return this.$store.getters['company/getCompanies']
    },
    userCompanies () {
      return this.$store.getters['userCompany/getUserCompanies']
    }
  },
  created () {
    this.$store.dispatch('user/fetchUsers')
    this.$store.dispatch('userRole/fetchUserRoles')
    this.$store.dispatch('company/fetchCompanies')
    this.$store.dispatch('userCompany/fetchUserCompanies')
  },
  methods: {
    openAddAssignmentDialog () {
      this.dialogTitle = 'Yeni Şirket Sorumlusu Ekle'
      this.selectedUserId = null
      this.selectedCompanyIds = []
      this.isEditMode = false
      this.dialog = true
    },
    openEditAssignmentDialog (assignment) {
      this.dialogTitle = 'Şirket Sorumlusunu Düzenle'
      this.selectedUserId = assignment.id
      this.selectedCompanyIds = this.getCompaniesByUserId(assignment.id).map(company => company.id)
      this.isEditMode = true
      this.dialog = true
    },
    closeDialog () {
      this.dialog = false
    },
    async saveAssignment () {
      if (this.$refs.form.validate()) {
        if (this.isEditMode) {
          if (this.selectedCompanyIds.length > 0) {
            await this.$store.dispatch('userCompany/removeUserCompaniesByUserId', this.selectedUserId)

            for (const companyId of this.selectedCompanyIds) {
              const userCompany = {
                userId: this.selectedUserId,
                companyId
              }
              await this.$store.dispatch('userCompany/addUserCompany', userCompany)
            }

            await this.fetchUpdatedUserCompanies()
          }
        } else if (this.selectedUserId && this.selectedCompanyIds.length > 0) {
          const updatedUser = this.users.find(user => user.id === this.selectedUserId)
          if (updatedUser) {
            updatedUser.roleIds = [2]
            await this.$store.dispatch('user/updateUser', updatedUser)

            for (const companyId of this.selectedCompanyIds) {
              const userCompany = {
                userId: this.selectedUserId,
                companyId
              }
              await this.$store.dispatch('userCompany/addUserCompany', userCompany)
            }

            await this.fetchUpdatedUserCompanies()
          }
        }
        this.closeDialog()
      }
    },

    async deleteAssignment (id) {
      await this.$store.dispatch('userCompany/deleteUserCompany', id)
      await this.fetchUpdatedUserCompanies()
    },

    async fetchUpdatedUserCompanies () {
      await this.$store.dispatch('userCompany/fetchUserCompanies')
    },
    getCompaniesByUserId (userId) {
      const userCompanies = this.$store.getters['userCompany/getUserCompaniesByUserId'](userId)
      return userCompanies.map(uc => this.companies.find(company => company.id === uc.companyId))
    }
  }
}
</script>
