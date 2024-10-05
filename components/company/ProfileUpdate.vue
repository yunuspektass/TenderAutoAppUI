<template>
  <v-container v-if="!loading" fluid>
    <v-card class="mb-6">
      <v-card-title class="text-h5">
        Şirket Bilgileri
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="formValid" @submit.prevent="submitCompany">
          <v-text-field
            v-model="companyCopy.companyName"
            label="Firma Adı"
            :rules="[v => !!v || 'Firma adı zorunludur']"
            required
          />
          <v-text-field
            v-model="companyCopy.address"
            label="Adres"
            :rules="[v => !!v || 'Adres zorunludur']"
            required
          />
          <v-text-field
            v-model="companyCopy.contactInformation"
            label="İletişim Bilgileri"
            :rules="[v => !!v || 'İletişim bilgileri zorunludur']"
            required
          />
          <v-text-field
            v-model="companyCopy.taxNumber"
            label="Vergi Numarası"
            :rules="[v => !!v || 'Vergi numarası zorunludur']"
            required
          />
          <v-text-field
            v-model="companyCopy.sector"
            label="Sektör"
            :rules="[v => !!v || 'Sektör zorunludur']"
            required
          />
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" text :disabled="!formValid" @click="submitCompany">
              Güncelle
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>

  <v-container v-else fluid class="d-flex align-center justify-center" style="height: 100vh">
    <v-row align="center" justify="center">
      <v-progress-circular indeterminate color="primary" />
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      loading: true,
      formValid: false,
      companyCopy: {
        id: null,
        companyName: '',
        address: '',
        contactInformation: '',
        taxNumber: '',
        sector: '',
        userIds: [],
        tenderIds: []
      }
    }
  },
  computed: {
    ...mapGetters({
      getCompanyById: 'company/getCompanyById',
      getUserCompaniesByUserId: 'userCompany/getUserCompaniesByUserId',
      getCompanyTendersByCompanyId: 'companyTender/getCompanyTendersByCompanyId'
    }),
    currentUser () {
      return this.$auth.user || null
    },
    userCompany () {
      if (this.currentUser) {
        const userCompanies = this.getUserCompaniesByUserId(this.currentUser.id)
        return userCompanies.length > 0 ? userCompanies[0] : null
      }
      return null
    }
  },
  watch: {
    userCompany: {
      handler (newVal) {
        if (newVal) {
          const companyData = this.getCompanyById(newVal.companyId)
          this.companyCopy = { ...companyData }
          this.companyCopy.userIds = this.getUserCompaniesByUserId(this.currentUser.id).map(userCompany => userCompany.userId)
          this.companyCopy.tenderIds = this.getCompanyTendersByCompanyId(newVal.companyId).map(tender => tender.tenderId)
        }
      },
      immediate: true
    }
  },
  async created () {
    await this.initializeData()
    this.loading = false
  },
  methods: {
    async initializeData () {
      try {
        await this.$store.dispatch('company/fetchCompanies')
        await this.$store.dispatch('userCompany/fetchUserCompanies')
        await this.$store.dispatch('companyTender/fetchCompanyTenders')
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error)
      }
    },
    async submitCompany () {
      if (this.$refs.form.validate()) {
        try {
          const updatedCompany = { ...this.companyCopy }
          await this.$store.dispatch('company/updateCompany', updatedCompany)
          console.log('Şirket başarıyla güncellendi.')
        } catch (error) {
          console.error('Şirket güncellenirken hata oluştu:', error)
        }
      }
    }
  }
}
</script>
