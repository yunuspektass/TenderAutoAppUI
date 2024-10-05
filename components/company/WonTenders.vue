<template>
  <v-container v-if="!loading" fluid>
    <v-card class="mb-6">
      <v-card-title class="text-h5">
        {{ companyName }} İhaleleri ve Teklif Detayları
      </v-card-title>
      <v-card-subtitle>
        {{ companyDescription }}
      </v-card-subtitle>
    </v-card>

    <v-row class="mb-6">
      <v-col cols="12" md="4">
        <v-card class="pa-4">
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
            >
              {{ companyTenderStats.totalTenders }}
            </v-progress-circular>
            <div>Toplam İhaleler: {{ companyTenderStats.totalTenders }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4">
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
            >
              {{ companyTenderStats.wonTenders }}
            </v-progress-circular>
            <div>Kazanılan İhaleler: {{ companyTenderStats.wonTenders }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4">
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
            >
              {{ companyTenderStats.lostTenders }}
            </v-progress-circular>
            <div>Kaybedilen İhaleler: {{ companyTenderStats.lostTenders }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mb-6">
      <v-card-title>
        İhaleler
      </v-card-title>
      <v-card-text>
        <v-expansion-panels multiple>
          <v-expansion-panel
            v-for="tender in formattedCompanyTenders"
            :key="tender.id"
          >
            <v-expansion-panel-header>
              {{ tender.title }} - {{ tenderTypeLabel(tender.tenderType) }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-list>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Başlangıç Tarihi: {{ tender.startDate | formatDate }}</v-list-item-title>
                    <v-list-item-subtitle>Bitiş Tarihi: {{ tender.endDate | formatDate }}</v-list-item-subtitle>
                    <v-list-item-subtitle>Açıklama: {{ tender.description }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Teklif Miktarı: {{ tender.offerAmount | formatCurrency }}</v-list-item-title>
                    <v-list-item-subtitle>Kazanıldı: {{ tender.won ? 'Evet' : 'Hayır' }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-divider />
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      Ürünler
                    </v-list-item-title>
                    <v-list-item-subtitle v-for="product in tender.products" :key="product.id">
                      {{ product.productName }} - Miktar: {{ product.quantity }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>

    <v-card class="mt-6">
      <v-card-title>
        Şirket Sorumluları
      </v-card-title>
      <v-card-text>
        <v-expansion-panels>
          <v-expansion-panel
            v-for="user in companyUsers"
            :key="user.id"
          >
            <v-expansion-panel-header>
              {{ user.name }} {{ user.lastName }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle>Ad: {{ user.name }}</v-list-item-subtitle>
                    <v-list-item-subtitle>Soyad: {{ user.lastName }}</v-list-item-subtitle>
                    <v-list-item-subtitle>E-posta: {{ user.email }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
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
      loading: true
    }
  },
  computed: {
    ...mapGetters({
      getCompanyById: 'company/getCompanyById',
      getCompanyTendersByCompanyId: 'companyTender/getCompanyTendersByCompanyId',
      getCompanyTenderStatsByCompanyId: 'companyTender/getCompanyTenderStatsByCompanyId',
      getUserCompaniesByCompanyId: 'userCompany/getUserCompaniesByCompanyId',
      getUserById: 'user/getUserById',
      getOffersByCompanyId: 'offer/getOffersByCompanyId',
      getTenderProductsByTenderId: 'tenderProduct/getTenderProductsByTenderId',
      getProducts: 'product/getProducts'
    }),
    currentUser () {
      return this.$auth.user || null
    },
    userCompany () {
      if (this.currentUser) {
        const userCompanies = this.$store.getters['userCompany/getUserCompaniesByUserId'](this.currentUser.id)
        return userCompanies.length > 0 ? userCompanies[0] : null
      }
      return null
    },
    company () {
      return this.userCompany ? this.getCompanyById(this.userCompany.companyId) : null
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
      return this.company
        ? this.getCompanyTenderStatsByCompanyId(this.company.id)
        : {
            totalTenders: 0,
            wonTenders: 0,
            lostTenders: 0
          }
    },
    companyTenders () {
      return this.company ? this.getCompanyTendersByCompanyId(this.company.id) : []
    },
    companyUsers () {
      if (this.company) {
        const userCompanies = this.getUserCompaniesByCompanyId(this.company.id)
        return userCompanies.map(userCompany => this.getUserById(userCompany.userId))
      }
      return []
    },
    formattedCompanyTenders () {
      return this.companyTenders.map((tender) => {
        const tenderProducts = this.getTenderProductsByTenderId(tender.tender.id) || []
        const detailedTenderProducts = tenderProducts.map((product) => {
          const detailedProduct = this.getProducts.find(p => p.id === product.productId) || {}
          return {
            productName: detailedProduct.productName || 'Bilinmeyen Ürün',
            quantity: product.quantity || 0
          }
        })

        const offer = this.getOffersByCompanyId(this.company.id).find(o => o.tenderId === tender.tender.id) || {}

        return {
          id: tender.tender.id,
          title: tender.tender.title,
          startDate: tender.tender.startDate,
          endDate: tender.tender.endDate,
          description: tender.tender.description,
          tenderType: tender.tender.tenderType,
          offerAmount: offer.amount || 0,
          won: tender.awardedAmount > 0,
          products: detailedTenderProducts
        }
      })
    }
  },
  async created () {
    await this.initializeData()
    this.loading = false
  },
  methods: {
    tenderTypeLabel (tenderType) {
      switch (tenderType) {
        case 'OpenTender':
          return 'Açık İhale'
        case 'ClosedTender':
          return 'Kapalı İhale'
        case 'InvitedTender':
          return 'Davetli İhale'
        case 'NegotiationProcedure':
          return 'Pazarlık Usulü'
        default:
          return 'Bilinmeyen İhale Türü'
      }
    },
    async initializeData () {
      try {
        if (this.currentUser && this.currentUser.id) {
          await this.$store.dispatch('userCompany/fetchUserCompanies')
          await this.$store.dispatch('user/fetchUsers')
          await this.$store.dispatch('offer/fetchOffers')
          await this.$store.dispatch('tenderProduct/fetchTenderProducts')
          await this.$store.dispatch('product/fetchProducts')

          const userCompanyList = this.$store.getters['userCompany/getUserCompaniesByUserId'](this.currentUser.id)
          const userCompany = userCompanyList.length > 0 ? userCompanyList[0] : null

          if (userCompany && userCompany.companyId) {
            await this.$store.dispatch('companyTender/fetchCompanyTenders')
            await this.$store.dispatch('company/fetchCompanyById', userCompany.companyId)
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
