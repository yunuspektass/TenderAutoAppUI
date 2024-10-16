<template>
  <v-container v-if="!loading" fluid>
    <v-card class="mb-6">
      <v-card-title class="text-h5">
        Teklif Verilmiş İhaleler ve Şirket Detayları
      </v-card-title>
      <v-card-subtitle>
        Bu sayfada tüm teklif verilen ihaleler ve bu teklifleri veren şirketlerin detayları gösterilmektedir.
      </v-card-subtitle>
    </v-card>

    <v-card>
      <v-tabs v-model="activeTab" background-color="transparent" grow>
        <v-tab v-for="offer in formattedOffers" :key="offer.id">
          {{ offer.tenderTitle }} - {{ offer.companyName }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="activeTab">
        <v-tab-item v-for="offer in formattedOffers" :key="offer.id">
          <v-card flat>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title class="text-h6">
                        Firma Detayları
                      </v-list-item-title>
                      <v-list-item-subtitle>Adres: {{ offer.companyAddress }}</v-list-item-subtitle>
                      <v-list-item-subtitle>İletişim: {{ offer.companyContact }}</v-list-item-subtitle>
                      <v-list-item-subtitle>Sektör: {{ offer.companySector }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
                <v-col cols="12" md="6">
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title class="text-h6">
                        İhale Detayları
                      </v-list-item-title>
                      <v-list-item-subtitle>Başlangıç Tarihi: {{ offer.tenderStartDate | formatDate }}</v-list-item-subtitle>
                      <v-list-item-subtitle>Bitiş Tarihi: {{ offer.tenderEndDate | formatDate }}</v-list-item-subtitle>
                      <v-list-item-subtitle>Açıklama: {{ offer.tenderDescription }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
              </v-row>
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="text-h6">
                    Teklif Detayları
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Teklif Miktarı: {{ offer.amount | formatCurrency }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="text-h6">
                    Ürünler
                  </v-list-item-title>
                  <v-list-item-subtitle v-for="product in offer.tenderProducts" :key="product.id">
                    {{ product.productName }} - Miktar: {{ product.quantity }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card-text>
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
      activeTab: null
    }
  },
  computed: {
    ...mapGetters({
      getOffers: 'offer/getOffers',
      getTenders: 'tender/getTenders',
      getCompanies: 'company/getCompanies',
      getCompanyById: 'company/getCompanyById',
      getTenderById: 'tender/getTenderById',
      getTenderProductsByTenderId: 'tenderProduct/getTenderProductsByTenderId',
      getProducts: 'product/getProducts'
    }),
    formattedOffers () {
      return this.getOffers.map((offer) => {
        const company = this.getCompanyById(offer.companyId) || {}
        const tender = this.getTenderById(offer.tenderId) || {}
        const tenderProducts = this.getTenderProductsByTenderId(offer.tenderId) || []

        const products = this.getProducts

        const detailedTenderProducts = tenderProducts.map((product) => {
          const detailedProduct = products.find(p => p.id === product.productId) || {}
          return {
            productName: detailedProduct.productName || 'Bilinmeyen Ürün',
            quantity: product.quantity || 0
          }
        })

        return {
          id: offer.id,
          companyName: company.companyName || 'Bilinmeyen Şirket',
          companyAddress: company.address || 'Adres Bilgisi Yok',
          companyContact: company.contactInformation || 'İletişim Bilgisi Yok',
          companySector: company.sector || 'Sektör Bilgisi Yok',
          tenderTitle: tender.title || 'İhale Bilgisi Yok',
          tenderStartDate: tender.startDate || '',
          tenderEndDate: tender.endDate || '',
          tenderDescription: tender.description || 'Açıklama Yok',
          amount: offer.amount || 0,
          tenderProducts: detailedTenderProducts
        }
      })
    }
  },
  async created () {
    await this.loadData()
  },
  methods: {
    async loadData () {
      try {
        await this.$store.dispatch('offer/fetchOffers')
        await this.$store.dispatch('tender/fetchTenders')
        await this.$store.dispatch('company/fetchCompanies')
        await this.$store.dispatch('tenderProduct/fetchTenderProducts')
        await this.$store.dispatch('product/fetchProducts')
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error)
      } finally {
        this.loading = false
      }
    },
    async selectWinner (tenderId, offerId) {
      try {
        await this.$store.dispatch('offer/selectWinner', { tenderId, offerId })
        await this.loadData()
      } catch (error) {
        console.error('Kazanan seçilirken hata oluştu:', error)
      }
    }
  }
}
</script>
