<template>
  <v-container v-if="!loading" fluid>
    <v-card class="mb-6">
      <v-card-title class="text-h5">
        {{ companyName }}
      </v-card-title>
      <v-card-subtitle>
        {{ companyDescription }}
      </v-card-subtitle>
    </v-card>

    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>
            <v-icon left>
              mdi-gavel
            </v-icon>
            Toplam İhale
          </v-card-title>
          <v-card-text class="text-center">
            <v-progress-circular
              :value="companyTenderStats.totalTenders"
              :size="60"
              :width="6"
              color="blue"
              class="mr-4"
            >
              {{ companyTenderStats.totalTenders }}
            </v-progress-circular>
            <div>Toplam İhaleler: {{ companyTenderStats.totalTenders }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>
            <v-icon left>
              mdi-trophy
            </v-icon>
            Kazanılan İhaleler
          </v-card-title>
          <v-card-text class="text-center">
            <v-progress-circular
              :value="companyTenderStats.wonTenders"
              :size="60"
              :width="6"
              color="green"
              class="mr-4"
            >
              {{ companyTenderStats.wonTenders }}
            </v-progress-circular>
            <div>Kazanılan İhaleler: {{ companyTenderStats.wonTenders }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>
            <v-icon left>
              mdi-close-circle
            </v-icon>
            Kaybedilen İhaleler
          </v-card-title>
          <v-card-text class="text-center">
            <v-progress-circular
              :value="companyTenderStats.lostTenders"
              :size="60"
              :width="6"
              color="red"
              class="mr-4"
            >
              {{ companyTenderStats.lostTenders }}
            </v-progress-circular>
            <div>Kaybedilen İhaleler: {{ companyTenderStats.lostTenders }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-container v-else fluid class="d-flex align-center justify-center" style="height: 100vh">
    <v-row align="center" justify="center">
      <v-progress-circular indeterminate color="primary" />
    </v-row>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      loading: true
    }
  },
  computed: {
    currentUser () {
      return this.$auth.user || null
    },
    userCompany () {
      if (this.currentUser) {
        const userCompanies = this.$store.getters['userCompany/getUserCompaniesByUserId'](this.currentUser.id)
        console.log('Fetched user companies:', userCompanies)
        return userCompanies.length > 0 ? userCompanies[0] : null
      }
      return null
    },
    company () {
      if (this.userCompany) {
        const fetchedCompany = this.$store.getters['company/getCompanyById'](this.userCompany.companyId)
        console.log('Fetched company:', fetchedCompany)
        return fetchedCompany
      }
      return null
    },
    companyName () {
      console.log('Company name computed:', this.company ? this.company.companyName : 'Bilinmeyen Şirket')
      return this.company ? this.company.companyName : 'Bilinmeyen Şirket'
    },
    companyDescription () {
      console.log('Company description computed:', this.company ? this.company.companyName : 'Şirketinizin ihalelere katılım ve başarı durumlarını buradan takip edebilirsiniz.')
      return this.company
        ? `${this.company.companyName} şirketinin ihalelere katılım ve başarı durumlarını buradan takip edebilirsiniz.`
        : 'Şirketinizin ihalelere katılım ve başarı durumlarını buradan takip edebilirsiniz.'
    },
    companyTenderStats () {
      if (this.company) {
        const stats = this.$store.getters['companyTender/getCompanyTenderStatsByCompanyId'](this.company.id)
        console.log('Company Tender Stats:', stats)
        return stats
      }
      return {
        totalTenders: 0,
        wonTenders: 0,
        lostTenders: 0
      }
    }
  },
  async created () {
    await this.initializeData()
    this.loading = false
  },
  methods: {
    async initializeData () {
      try {
        if (this.currentUser && this.currentUser.id) {
          console.log('Fetching user companies for user ID:', this.currentUser.id)
          await this.$store.dispatch('userCompany/fetchUserCompanies')

          const userCompanyList = this.$store.getters['userCompany/getUserCompaniesByUserId'](this.currentUser.id)
          const userCompany = userCompanyList.length > 0 ? userCompanyList[0] : null

          console.log('Fetched User Company:', userCompany)

          if (userCompany && userCompany.companyId) {
            console.log('User Company ID found:', userCompany.companyId)

            await this.$store.dispatch('companyTender/fetchCompanyTenders')
            await this.$store.dispatch('company/fetchCompanyById', userCompany.companyId)

            console.log('Company and Tenders fetched for Company ID:', userCompany.companyId)
          } else {
            console.error('userCompany veya companyId bulunamadı.')
          }
        }
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error)
      }
    }
  }
}
</script>
