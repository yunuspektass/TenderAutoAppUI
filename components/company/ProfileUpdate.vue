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
      selectedCompanyId: 'selectedCompany/getSelectedCompanyId',
      getCompanyById: 'company/getCompanyById',
      getUserCompaniesByUserId: 'userCompany/getUserCompaniesByUserId',
      getCompanyTendersByCompanyId: 'companyTender/getCompanyTendersByCompanyId'
    }),
    currentUser () {
      return this.$auth.user || null
    },
    company () {
      return this.getCompanyById(this.selectedCompanyId)
    }
  },
  watch: {
    selectedCompanyId: {
      immediate: true,
      handler: 'loadCompanyData'
    }
  },
  methods: {
    async loadCompanyData () {
      this.loading = true
      try {
        if (this.selectedCompanyId) {
          await this.$store.dispatch('company/fetchCompanyById', this.selectedCompanyId)
          await this.$store.dispatch('userCompany/fetchUserCompanies')
          await this.$store.dispatch('companyTender/fetchCompanyTenders', this.selectedCompanyId)
          const companyData = this.getCompanyById(this.selectedCompanyId)
          this.companyCopy = { ...companyData }
          this.companyCopy.userIds = this.getUserCompaniesByUserId(this.currentUser.id).map(userCompany => userCompany.userId)
          this.companyCopy.tenderIds = this.getCompanyTendersByCompanyId(this.selectedCompanyId).map(tender => tender.tenderId)
        }
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error)
      } finally {
        this.loading = false
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
