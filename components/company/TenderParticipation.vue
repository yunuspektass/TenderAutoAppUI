<template>
  <v-container v-if="!loading" fluid>
    <v-card class="mb-6">
      <v-card-title class="text-h5">
        {{ companyName }} ihaleleri
        <v-spacer />
        <v-btn color="primary" @click="openAddOfferDialog">
          Yeni Teklif Ver
        </v-btn>
      </v-card-title>
      <v-card-subtitle>
        {{ companyDescription }}
      </v-card-subtitle>
    </v-card>

    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="offerHeaders"
          :items="formattedOffers"
          class="elevation-1"
        >
          <template #[`item.amount`]="{ item }">
            <span>{{ item.amount | formatCurrency }}</span>
          </template>

          <template #[`item.offerDate`]="{ item }">
            <span>{{ item.offerDate | formatDate }}</span>
          </template>

          <template #[`item.startDate`]="{ item }">
            <span>{{ item.startDate | formatDate }}</span>
          </template>

          <template #[`item.endDate`]="{ item }">
            <span>{{ item.endDate | formatDate }}</span>
          </template>

          <template #[`item.products`]="{ item }">
            <v-expansion-panels flat>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  Ürünleri Görüntüle
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div v-for="product in item.products" :key="product.productName">
                    {{ product.productName }} - Miktar: {{ product.quantity }}
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </template>

          <template #[`item.actions`]="{ item }">
            <v-btn icon color="primary" @click="openEditOfferDialog(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon color="red" @click="deleteOffer(item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-dialog v-model="offerDialog" max-width="800px">
      <v-card>
        <v-card-title>
          {{ offer.id ? 'Teklifi Güncelle' : 'Yeni Teklif Ver' }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-form ref="form" v-model="formValid" @submit.prevent="submitOffer">
                <v-select
                  v-if="!offer.id"
                  v-model="offer.tenderId"
                  :items="relatedTenders"
                  item-text="title"
                  item-value="id"
                  label="İhale Seç"
                  :rules="[v => !!v || 'İhale seçilmelidir']"
                  required
                />
                <v-text-field
                  v-model="offer.amount"
                  label="Teklif Miktarı"
                  type="number"
                  :rules="[v => !!v || 'Teklif miktarı zorunludur', v => v > 0 || 'Teklif miktarı 0\'dan büyük olmalıdır']"
                  required
                />
              </v-form>
            </v-col>
            <v-col cols="12" md="6">
              <v-expansion-panels class="mt-3">
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    İhale Detayları
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div v-if="selectedTenderDetails">
                      {{ selectedTenderDetails }}
                    </div>
                    <div v-else>
                      İhale bilgisi bulunmamaktadır.
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeOfferDialog">
            İptal
          </v-btn>
          <v-btn color="blue darken-1" text :disabled="!formValid" @click="submitOffer">
            Kaydet
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      offerDialog: false,
      offer: {
        id: null,
        amount: 0,
        tenderId: null,
        companyId: null,
        offerDate: null
      },
      formValid: false,
      selectedTenderDetails: '',
      offerHeaders: [
        { text: 'İhale Başlığı', value: 'tenderTitle' },
        { text: 'Açıklama', value: 'description' },
        { text: 'İhale Türü', value: 'tenderType', sortable: false },
        { text: 'İhale Ürünleri', value: 'products', sortable: false },
        { text: 'Başlangıç Tarihi', value: 'startDate' },
        { text: 'Bitiş Tarihi', value: 'endDate' },
        { text: 'Teklif Miktarı', value: 'amount' },
        { text: 'Teklif Tarihi', value: 'offerDate' },
        { text: 'İşlemler', value: 'actions', sortable: false }
      ]
    }
  },
  computed: {
    ...mapGetters({
      getOffersByCompanyId: 'offer/getOffersByCompanyId',
      getCompanyById: 'company/getCompanyById',
      getTenders: 'tender/getTenders',
      getCompanyTendersByCompanyId: 'companyTender/getCompanyTendersByCompanyId',
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
    filteredOffers () {
      if (this.userCompany) {
        return this.getOffersByCompanyId(this.userCompany.companyId)
      }
      return []
    },
    formattedOffers () {
      return this.filteredOffers.map((offer) => {
        const tender = this.getTenders.find(t => t.id === offer.tenderId)
        const tenderProducts = this.getTenderProductsByTenderId(offer.tenderId) || []
        const products = tenderProducts.map((product) => {
          const detailedProduct = this.getProducts.find(p => p.id === product.productId)
          return {
            productName: detailedProduct ? detailedProduct.productName : 'Bilinmeyen Ürün',
            quantity: product.quantity || 0
          }
        })

        let tenderTypeLabel = ''
        if (tender) {
          switch (tender.tenderType) {
            case 'OpenTender':
              tenderTypeLabel = 'Açık İhale'
              break
            case 'ClosedTender':
              tenderTypeLabel = 'Kapalı İhale'
              break
            case 'InvitedTender':
              tenderTypeLabel = 'Davetli İhale'
              break
            case 'NegotiationProcedure':
              tenderTypeLabel = 'Pazarlık Usulü'
              break
            default:
              tenderTypeLabel = 'Bilinmeyen İhale Türü'
          }
        }
        return {
          ...offer,
          tenderTitle: tender ? tender.title : 'Bilinmeyen İhale',
          description: tender ? tender.description : '',
          tenderType: tender ? tenderTypeLabel : '',
          startDate: tender ? tender.startDate : '',
          endDate: tender ? tender.endDate : '',
          products
        }
      })
    },
    relatedTenders () {
      if (this.userCompany) {
        const companyTenders = this.getCompanyTendersByCompanyId(this.userCompany.companyId)
        return this.getTenders.filter(tender => companyTenders.some(ct => ct.tender.id === tender.id))
      }
      return []
    },
    companyName () {
      return this.userCompany && this.getCompanyById(this.userCompany.companyId)
        ? this.getCompanyById(this.userCompany.companyId).companyName
        : 'Bilinmeyen Şirket'
    },
    companyDescription () {
      return this.userCompany && this.getCompanyById(this.userCompany.companyId)
        ? `${this.getCompanyById(this.userCompany.companyId).companyName} şirketinin ihalelere katılım ve başarı durumlarını buradan takip edebilirsiniz.`
        : 'Şirketinizin ihalelere katılım ve başarı durumlarını buradan takip edebilirsiniz.'
    }
  },
  watch: {
    'offer.tenderId' (newTenderId) {
      this.updateTenderDetails(newTenderId)
    }
  },
  async created () {
    await this.initializeData()
    this.loading = false
  },
  methods: {
    async initializeData () {
      try {
        await this.$store.dispatch('userCompany/fetchUserCompanies')
        await this.$store.dispatch('company/fetchCompanies')
        await this.$store.dispatch('tender/fetchTenders')
        await this.$store.dispatch('offer/fetchOffers')
        await this.$store.dispatch('companyTender/fetchCompanyTenders')
        await this.$store.dispatch('tenderProduct/fetchTenderProducts')
        await this.$store.dispatch('product/fetchProducts')
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error)
      }
    },
    updateTenderDetails (tenderId) {
      const tender = this.getTenders.find(t => t.id === tenderId)
      if (tender) {
        const tenderProducts = this.getTenderProductsByTenderId(tenderId) || []
        const productDetails = tenderProducts.map((product) => {
          const detailedProduct = this.getProducts.find(p => p.id === product.productId)
          return `${detailedProduct ? detailedProduct.productName : 'Bilinmeyen Ürün'} - Miktar: ${product.quantity}`
        }).join(', ')

        this.selectedTenderDetails = `
        Başlık: ${tender.title}
        Açıklama: ${tender.description}
        Başlangıç Tarihi: ${this.$options.filters.formatDate(tender.startDate)}
        Bitiş Tarihi: ${this.$options.filters.formatDate(tender.endDate)}
        Ürünler: ${productDetails || 'Ürün bilgisi bulunmamaktadır.'}
      `
      } else {
        this.selectedTenderDetails = ''
      }
    },
    openAddOfferDialog () {
      this.offer = {
        id: null,
        amount: 0,
        tenderId: null,
        companyId: this.userCompany ? this.userCompany.companyId : null,
        offerDate: new Date().toISOString()
      }
      this.selectedTenderDetails = ''
      this.offerDialog = true
    },
    openEditOfferDialog (offer) {
      this.offer = { ...offer }
      this.updateTenderDetails(this.offer.tenderId)
      this.offerDialog = true
    },
    closeOfferDialog () {
      this.offerDialog = false
      this.offer = {
        id: null,
        amount: 0,
        tenderId: null,
        companyId: this.userCompany ? this.userCompany.companyId : null,
        offerDate: new Date().toISOString()
      }
    },
    async submitOffer () {
      if (this.$refs.form.validate()) {
        try {
          if (this.offer.id) {
            await this.$store.dispatch('offer/updateOffer', this.offer)
          } else {
            await this.$store.dispatch('offer/addOffer', this.offer)
          }
          await this.initializeData()
          this.closeOfferDialog()
        } catch (error) {
          console.error('Teklif verilirken hata oluştu:', error)
        }
      }
    },
    async deleteOffer (offerId) {
      try {
        await this.$store.dispatch('offer/deleteOffer', offerId)
        await this.initializeData()
      } catch (error) {
        console.error('Teklif silinirken hata oluştu:', error)
      }
    }
  }
}
</script>
