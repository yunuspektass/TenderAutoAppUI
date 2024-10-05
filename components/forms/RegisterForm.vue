<template>
  <v-form ref="form" v-model="formValid" @submit.prevent="register">
    <v-row no-gutters>
      <v-col cols="12" class="py-2">
        <v-text-field
          v-model="name"
          label="Ad"
          outlined
          required
          :rules="[v => !!v || 'Ad zorunludur']"
          prepend-icon="mdi-account"
          color="primary"
          dense
          class="mb-0"
        />
      </v-col>
      <v-col cols="12" class="py-2">
        <v-text-field
          v-model="lastName"
          label="Soyad"
          outlined
          required
          :rules="[v => !!v || 'Soyad zorunludur']"
          prepend-icon="mdi-account"
          color="primary"
          dense
          class="mb-0"
        />
      </v-col>
      <v-col cols="12" class="py-2">
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          outlined
          required
          :rules="[v => !!v || 'Email zorunludur', v => /.+@.+\..+/.test(v) || 'Geçerli bir email adresi girin']"
          prepend-icon="mdi-email"
          color="primary"
          dense
          class="mb-0"
        />
      </v-col>
      <v-col cols="12" class="py-2">
        <v-text-field
          v-model="password"
          label="Şifre"
          type="password"
          outlined
          required
          :rules="[v => !!v || 'Şifre zorunludur']"
          prepend-icon="mdi-lock"
          color="primary"
          dense
          class="mb-0"
        />
      </v-col>
      <v-col cols="12" class="py-2">
        <v-text-field
          v-model="phoneNumber"
          v-mask="'(###) ###-####'"
          label="Telefon Numarası"
          outlined
          required
          :rules="[v => !!v || 'Telefon numarası zorunludur', v => /^\(\d{3}\) \d{3}-\d{4}$/.test(v) || 'Geçerli bir telefon numarası girin']"
          prepend-icon="mdi-phone"
          color="primary"
          dense
          class="mb-0"
        />
      </v-col>
      <v-col cols="12" class="py-2">
        <v-text-field
          v-model="address"
          label="Adres"
          outlined
          required
          :rules="[v => !!v || 'Adres zorunludur']"
          prepend-icon="mdi-map-marker"
          color="primary"
          dense
          class="mb-0"
        />
      </v-col>
    </v-row>
    <v-btn
      type="submit"
      color="primary"
      class="mt-3 text-uppercase font-weight-bold"
      block
      :disabled="!formValid"
    >
      Kayıt Ol
    </v-btn>
  </v-form>
</template>

<script>
import { mask } from 'vue-the-mask'

export default {
  directives: {
    mask
  },
  data () {
    return {
      name: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      address: '',
      formValid: false
    }
  },
  methods: {
    async register () {
      if (this.formValid) {
        try {
          await this.$axios.post('/api/Auth/Register', {
            name: this.name,
            lastName: this.lastName,
            email: this.email,
            password: this.password,
            phoneNumber: this.phoneNumber,
            address: this.address
          })

          this.$emit('register-success', {
            email: this.email,
            password: this.password
          })
        } catch (error) {
          console.error('Kayıt başarısız oldu:', error)
        }
      }
    }
  }
}
</script>
