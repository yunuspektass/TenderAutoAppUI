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
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      loading: true
    }
  },
  computed: {
    ...mapGetters({
      selectedCompanyId: 'selectedCompany/getSelectedCompanyId',
      getCompanyById: 'company/getCompanyById',
      getCompanyTenderStatsByCompanyId: 'companyTender/getCompanyTenderStatsByCompanyId'
    }),
    company () {
      return this.getCompanyById(this.selectedCompanyId)
    },
    companyName () {
      return this.company ? this.company.companyName : 'Bilinmeyen Şirket'
    },
    companyDescription () {
      return this.company
        ? `${this.company.companyName} şirketinin ihalelere katılım ve başarı durumlarını buradan takip edebilirsiniz.`
        : 'Şirketinizin ihalelere katılım ve başarı durumlarını buradan takip edebilirsiniz.'
    },
    companyTenderStats () {
      if (this.company) {
        return this.getCompanyTenderStatsByCompanyId(this.company.id)
      }
      return {
        totalTenders: 0,
        wonTenders: 0,
        lostTenders: 0
      }
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
          await this.$store.dispatch('companyTender/fetchCompanyTenders', this.selectedCompanyId)
        }
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
