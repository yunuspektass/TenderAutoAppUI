<template>
  <v-container fluid class="pa-0 d-flex align-center justify-center fill-height">
    <v-card outlined class="pa-8" style="width: 100%; max-width: 600px;">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6 font-weight-bold">Giriş Yap</span>
        <v-btn
          text
          color="primary"
          style="font-size: 12px;"
          @click="$router.push('/register')"
        >
          Kayıt Ol
        </v-btn>
      </v-card-title>
      <v-card-text>
        <LoginForm />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import LoginForm from '@/components/forms/LoginForm.vue'

export default {
  components: {
    LoginForm
  }
}
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
