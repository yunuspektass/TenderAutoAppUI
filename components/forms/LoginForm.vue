<template>
  <v-form @submit.prevent="login">
    <v-text-field
      v-model="email"
      label="Email"
      type="email"
      outlined
      required
      dense
    />
    <v-text-field
      v-model="password"
      label="Şifre"
      type="password"
      outlined
      required
      dense
    />
    <v-card-actions class="d-flex justify-end pa-0">
      <v-btn
        type="submit"
        :loading="loading"
        color="primary"
        class="text-uppercase font-weight-bold"
      >
        Giriş Yap
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      password: '',
      loading: false
    }
  },
  methods: {
    login () {
      this.loading = true
      this.$auth.loginWith('local', {
        data: {
          email: this.email,
          password: this.password
        }
      })
        .catch(() => {
          alert('LOGIN ERROR')
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
