<template>
  <v-card>
    <v-card-title>
      Kullanıcı Yönetimi
      <v-spacer />
      <v-btn color="primary" @click="openAddUserDialog">
        Yeni Kullanıcı Ekle
      </v-btn>
    </v-card-title>
    <v-card-subtitle>Kullanıcıları görüntüleyebilir, ekleyebilir, düzenleyebilir ve silebilirsiniz.</v-card-subtitle>

    <v-data-table
      :headers="headers"
      :items="users"
      class="elevation-1"
      item-value="id"
      :items-per-page="10"
    >
      <template #[`item.roles`]="{ item }">
        <v-expansion-panels flat>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Yetkileri Görüntüle
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div v-for="userRole in getUserRolesByUserId(item.id)" :key="userRole.id">
                {{ getRoleNameById(userRole.roleId) }}
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>

      <template #[`item.actions`]="{ item }">
        <v-btn icon color="primary" @click="openEditUserDialog(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon color="red" @click="deleteUser(item.id)">
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
              v-model="user.name"
              label="Ad"
              :rules="[v => !!v || 'Ad zorunludur']"
              required
            />
            <v-text-field
              v-model="user.lastName"
              label="Soyad"
              :rules="[v => !!v || 'Soyad zorunludur']"
              required
            />
            <v-text-field
              v-model="user.email"
              label="Email"
              :rules="[v => !!v || 'Email zorunludur', v => /.+@.+\..+/.test(v) || 'Geçerli bir email adresi girin']"
              required
            />
            <v-text-field
              v-model="user.password"
              label="Şifre"
              type="password"
              :rules="[v => !!v || 'Şifre zorunludur', v => v.length >= 6 || 'Şifre en az 6 karakter olmalıdır']"
              required
            />
            <v-text-field
              v-model="user.phoneNumber"
              label="Telefon Numarası"
              :rules="[v => !!v || 'Telefon numarası zorunludur', v => /^\d+$/.test(v) || 'Geçerli bir telefon numarası girin']"
              required
            />
            <v-text-field
              v-model="user.address"
              label="Adres"
              :rules="[v => !!v || 'Adres zorunludur']"
              required
            />
            <v-select
              v-model="user.roleIds"
              :items="roles"
              item-text="roleName"
              item-value="id"
              label="Rol Seç"
              multiple
              :rules="[v => v.length > 0 || 'En az bir rol seçilmelidir']"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="closeDialog">
            İptal
          </v-btn>
          <v-btn color="blue darken-1" text :disabled="!formValid" @click="saveUser">
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
      user: {
        id: null,
        name: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        address: '',
        roleIds: []
      },
      headers: [
        { text: 'Ad', value: 'name' },
        { text: 'Soyad', value: 'lastName' },
        { text: 'Email', value: 'email' },
        { text: 'Yetkiler', value: 'roles', sortable: false },
        { text: 'İşlemler', value: 'actions', sortable: false }
      ]
    }
  },
  computed: {
    users () {
      return this.$store.getters['user/getUsers']
    },
    roles () {
      return this.$store.getters['user/getRoles'].map((role) => {
        switch (role.id) {
          case 1:
            return { ...role, roleName: 'Admin' }
          case 2:
            return { ...role, roleName: 'Firma Temsilcisi' }
          case 3:
            return { ...role, roleName: 'İhale Sorumlusu' }
          case 4:
            return { ...role, roleName: 'Genel Kullanıcı' }
          default:
            return role
        }
      })
    },
    getUserRolesByUserId () {
      return this.$store.getters['userRole/getUserRolesByUserId']
    },
    getRoleNameById () {
      return this.$store.getters['userRole/getRoleNameById']
    }
  },
  created () {
    this.$store.dispatch('user/fetchUsers')
    this.$store.dispatch('user/fetchRoles')
    this.$store.dispatch('userRole/fetchUserRoles')
  },
  methods: {
    openAddUserDialog () {
      this.dialogTitle = 'Yeni Kullanıcı Ekle'
      this.user = {
        id: null,
        name: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        address: '',
        roleIds: []
      }
      this.dialog = true
    },
    openEditUserDialog (user) {
      this.dialogTitle = 'Kullanıcıyı Düzenle'
      this.user = {
        ...user,
        lastName: user.lastName,
        roleIds: Array.isArray(user.roles) ? user.roles.map(role => role.id) : []
      }
      this.dialog = true
    },
    closeDialog () {
      this.dialog = false
    },
    async fetchAllData () {
      try {
        await this.$store.dispatch('user/fetchUsers')
        await this.$store.dispatch('user/fetchRoles')
        await this.$store.dispatch('userRole/fetchUserRoles')
      } catch (error) {
        console.error('Veri çekerken hata:', error)
      }
    },

    async saveUser () {
      if (this.$refs.form.validate()) {
        try {
          if (this.user.id) {
            await this.$store.dispatch('user/updateUser', this.user)
          } else {
            await this.$store.dispatch('user/addUser', this.user)
          }
          await this.fetchAllData()
        } catch (error) {
          console.error('Kullanıcı kaydedilirken hata:', error)
        } finally {
          this.closeDialog()
        }
      }
    },

    async deleteUser (id) {
      try {
        await this.$store.dispatch('user/deleteUser', id)
        await this.fetchAllData()
      } catch (error) {
        console.error('Kullanıcı silinirken hata:', error)
      }
    }
  }
}
</script>
