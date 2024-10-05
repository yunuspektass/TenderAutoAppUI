<template>
  <v-form ref="form" v-model="formValid" @submit.prevent="login">
    <v-text-field
      v-model="email"
      label="Email"
      type="email"
      outlined
      required
      dense
      prepend-icon="mdi-email"
      :rules="[v => !!v || 'Email zorunludur', v => /.+@.+\..+/.test(v) || 'Geçerli bir email adresi girin']"
    />
    <v-text-field
      v-model="password"
      label="Şifre"
      type="password"
      outlined
      required
      dense
      prepend-icon="mdi-lock"
      :rules="[v => !!v || 'Şifre zorunludur']"
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
      loading: false,
      formValid: false
    }
  },
  methods: {
    login () {
      if (!this.formValid) {
        return
      }

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
