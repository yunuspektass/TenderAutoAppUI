<template>
  <v-container>
    <v-card>
      <v-card-title>Profili Düzenle</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="formValid">
          <v-text-field
            v-model="user.name"
            label="İsim"
            :rules="[v => !!v || 'İsim zorunludur']"
            required
          />
          <v-text-field
            v-model="user.lastName"
            label="Soyisim"
            :rules="[v => !!v || 'Soyisim zorunludur']"
            required
          />
          <v-text-field
            v-model="user.password"
            label="Şifre"
            type="password"
            :rules="[v => !!v || 'Şifre zorunludur']"
            required
          />
          <v-text-field
            v-model="user.email"
            label="E-posta"
            :rules="[
              v => !!v || 'E-posta zorunludur',
              v => /.+@.+\..+/.test(v) || 'Geçerli bir e-posta adresi giriniz'
            ]"
            required
          />
          <v-text-field
            v-model="user.phoneNumber"
            label="Telefon Numarası"
            :rules="[v => !!v || 'Telefon numarası zorunludur']"
            required
          />
          <v-textarea
            v-model="user.address"
            label="Adres"
            :rules="[v => !!v || 'Adres zorunludur']"
            required
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="saveProfile">
          Kaydet
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      formValid: false,
      user: {
        id: null,
        name: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        password: ''
      }
    }
  },
  created () {
    this.loadUserData()
  },
  methods: {
    ...mapActions('user', ['updateUser']),
    loadUserData () {
      const userData = this.$auth.user
      if (userData) {
        this.user = {
          id: userData.id,
          name: userData.name,
          lastName: userData.lastName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          address: userData.address,
          password: ''
        }
      }
    },
    async saveProfile () {
      if (this.$refs.form.validate()) {
        try {
          let roleIds = []
          if (this.$auth.user.roles) {
            if (Array.isArray(this.$auth.user.roles.$values)) {
              roleIds = this.$auth.user.roles.$values.map(role => role.id)
            } else if (Array.isArray(this.$auth.user.roles)) {
              roleIds = this.$auth.user.roles.map(role => role.id)
            }
          }

          const updatedUser = {
            ...this.user,
            roleIds
          }

          await this.updateUser(updatedUser)

          const userData = { ...updatedUser }
          delete userData.password
          this.$auth.user = userData
        } catch (error) {
          console.error('Profil güncellenirken hata:', error)
        }
      }
    }
  }
}
</script>
