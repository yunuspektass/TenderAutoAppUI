<template>
  <v-container v-if="!loading" fluid>
    <v-card class="mb-6">
      <v-card-title class="text-h5">
        Yönetim Paneli
      </v-card-title>
      <v-card-subtitle>
        İhale Yönetim Sistemi'nin özet bilgileri ve analizleri.
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
              :value="tenders.length"
              :size="60"
              :width="6"
              color="purple"
              class="mr-4"
            >
              {{ tenders.length }}
            </v-progress-circular>
            <div>Aktif İhaleler: {{ tenders.length }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>
            <v-icon left>
              mdi-domain
            </v-icon>
            Toplam Firma
          </v-card-title>
          <v-card-text class="text-center">
            <v-progress-circular
              :value="companies.length"
              :size="60"
              :width="6"
              color="blue"
              class="mr-4"
            >
              {{ companies.length }}
            </v-progress-circular>
            <div>Aktif Firmalar: {{ companies.length }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>
            <v-icon left>
              mdi-office-building
            </v-icon>
            Toplam Birim
          </v-card-title>
          <v-card-text class="text-center">
            <v-progress-circular
              :value="units.length"
              :size="60"
              :width="6"
              color="green"
              class="mr-4"
            >
              {{ units.length }}
            </v-progress-circular>
            <div>Aktif Birimler: {{ units.length }}</div>
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
    tenders () {
      return this.$store.getters['tender/getTenders']
    },
    companies () {
      return this.$store.getters['company/getCompanies']
    },
    units () {
      return this.$store.getters['unit/getUnits']
    }
  },
  async created () {
    await this.loadData()
  },
  methods: {
    async loadData () {
      try {
        await this.$store.dispatch('tender/fetchTenders')
        await this.$store.dispatch('company/fetchCompanies')
        await this.$store.dispatch('unit/fetchUnits')
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
