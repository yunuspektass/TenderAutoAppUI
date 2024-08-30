<template>
  <v-container class="d-flex align-center justify-center fill-height" fluid>
    <v-card max-width="400" class="pa-5">
      <v-card-title class="text-center">
        <strong>Kayıt Ol</strong>
      </v-card-title>
      <v-card-text>
        <RegisterForm @register-success="onRegisterSuccess" />
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="primary" class="text-uppercase font-weight-bold" @click="$router.push('/login')">
          Giriş Yap
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import RegisterForm from '@/components/forms/RegisterForm.vue'

export default {
  auth: 'guest',
  components: {
    RegisterForm
  },
  methods: {
    async onRegisterSuccess (email, password) {
      try {
        await this.$auth.loginWith('local', {
          data: {
            email,
            password
          }
        })

        this.$router.push('/user/dashboard')
      } catch (error) {
        console.error('Kayıt olma başarısız oldu:', error)
      }
    }
  }
}
</script>
