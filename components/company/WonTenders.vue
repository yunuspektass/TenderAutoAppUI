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

    <v-card>
      <v-tabs v-model="activeMainTab">
        <v-tab>İhaleler</v-tab>
        <v-tab>Şirket Sorumluları</v-tab>
      </v-tabs>

      <v-tabs-items v-model="activeMainTab">
        <v-tab-item>
          <v-card flat>
            <v-tabs v-model="activeTenderTab">
              <v-tab v-for="tender in formattedCompanyTenders" :key="tender.id">
                {{ tender.title }}
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="activeTenderTab">
              <v-tab-item v-for="tender in formattedCompanyTenders" :key="tender.id">
                <v-card flat>
                  <v-card-text>
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>İhale Türü: {{ tenderTypeLabel(tender.tenderType) }}</v-list-item-title>
                          <v-list-item-subtitle>Başlangıç Tarihi: {{ tender.startDate | formatDate }}</v-list-item-subtitle>
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
                          <v-list-item-title>Ürünler</v-list-item-title>
                          <v-list-item-subtitle v-for="product in tender.products" :key="product.id">
                            {{ product.productName }} - Miktar: {{ product.quantity }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-tab-item>

        <v-tab-item>
          <v-card flat>
            <v-tabs v-model="activeUserTab">
              <v-tab v-for="user in companyUsers" :key="user.id">
                {{ user.name }} {{ user.lastName }}
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="activeUserTab">
              <v-tab-item v-for="user in companyUsers" :key="user.id">
                <v-card flat>
                  <v-card-text>
                    <v-list dense>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-subtitle>Ad: {{ user.name }}</v-list-item-subtitle>
                          <v-list-item-subtitle>Soyad: {{ user.lastName }}</v-list-item-subtitle>
                          <v-list-item-subtitle>E-posta: {{ user.email }}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
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
      activeMainTab: null,
      activeTenderTab: null,
      activeUserTab: null
    }
  },
  computed: {
    ...mapGetters({
      selectedCompanyId: 'selectedCompany/getSelectedCompanyId',
      getCompanyById: 'company/getCompanyById',
      getCompanyTendersByCompanyId: 'companyTender/getCompanyTendersByCompanyId',
      getCompanyTenderStatsByCompanyId: 'companyTender/getCompanyTenderStatsByCompanyId',
      getUserCompaniesByCompanyId: 'userCompany/getUserCompaniesByCompanyId',
      getUserById: 'user/getUserById',
      getOffersByCompanyId: 'offer/getOffersByCompanyId',
      getTenderProductsByTenderId: 'tenderProduct/getTenderProductsByTenderId',
      getProducts: 'product/getProducts'
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
  watch: {
    selectedCompanyId: {
      immediate: true,
      handler: 'loadCompanyData'
    }
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
    async loadCompanyData () {
      this.loading = true
      try {
        if (this.selectedCompanyId) {
          await this.$store.dispatch('company/fetchCompanyById', this.selectedCompanyId)
          await this.$store.dispatch('user/fetchUsers')
          await this.$store.dispatch('offer/fetchOffers')
          await this.$store.dispatch('tenderProduct/fetchTenderProducts')
          await this.$store.dispatch('product/fetchProducts')
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
