<template>
  <v-container v-if="!loading" fluid>
    <v-card class="mb-6">
      <v-card-title class="text-h5">
        Sonuçlandırılmış İhaleler
      </v-card-title>
      <v-card-subtitle>
        Kazanan teklifleri içeren sonuçlandırılmış ihaleler aşağıda gösterilmektedir.
      </v-card-subtitle>

      <v-data-table :headers="finishedTendersHeaders" :items="getFinishedTenders" class="elevation-1">
        <template #[`item.awardedAmount`]="{ item }">
          {{ item.awardedAmount ? item.awardedAmount || formatCurrency : 'Veri yok' }}
        </template>

        <template #[`item.companyName`]="{ item }">
          {{ getCompanyById(item.winnerCompanyId)?.companyName || 'Bilinmeyen Şirket' }}
        </template>

        <template #[`item.details`]="{ item }">
          <v-list-item-subtitle>
            Başlangıç: {{ item.startDate | formatDate }}<br>
            Bitiş: {{ item.endDate | formatDate }}<br>
            Açıklama: {{ item.description || 'Açıklama Yok' }}<br>
            Sektör: {{ getCompanyById(item.winnerCompanyId)?.sector || 'Bilinmeyen Sektör' }}<br>
            İletişim: {{ getCompanyById(item.winnerCompanyId)?.contactInformation || 'Bilinmeyen İletişim' }}
          </v-list-item-subtitle>
        </template>
      </v-data-table>
    </v-card>

    <v-card class="mb-6">
      <v-card-title class="text-h5">
        Teklif Yönetimi
      </v-card-title>
      <v-card-subtitle>
        Aktif ihalelere verilen teklifler ve detaylar aşağıda listelenmektedir.
      </v-card-subtitle>

      <v-data-table :headers="tenderHeaders" :items="getActiveTenders" class="elevation-1">
        <template #[`item.details`]="{ item }">
          <v-list-item-subtitle>
            Başlangıç: {{ item.startDate | formatDate }}<br>
            Bitiş: {{ item.endDate | formatDate }}<br>
            Ürünler:
            <v-list v-for="product in getTenderProductsByTenderId(item.id)" :key="product.id" dense>
              {{ getProductById(product.productId)?.productName || 'Bilinmeyen Ürün' }} - Miktar: {{ product.quantity }}
            </v-list>
          </v-list-item-subtitle>
        </template>

        <template #[`item.startDate`]="{ item }">
          {{ item.startDate | formatDate }}
        </template>

        <template #[`item.endDate`]="{ item }">
          {{ item.endDate | formatDate }}
        </template>

        <template #[`item.actions`]="{ item }">
          <v-btn color="primary" icon @click.stop="toggleOffers(item.id)">
            <v-icon>mdi-eye</v-icon> Teklifler
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Teklifler Card -->
    <v-card v-if="selectedTenderOffers" class="mb-6">
      <v-card-title class="text-h5">
        Teklifler
      </v-card-title>

      <v-data-table :headers="offerHeaders" :items="selectedTenderOffers" class="elevation-1">
        <template #[`item.companyName`]="{ item }">
          {{ getCompanyById(item.companyId)?.companyName || 'Bilinmeyen Şirket' }}
        </template>

        <template #[`item.amount`]="{ item }">
          {{ item.amount | formatCurrency }}
        </template>

        <template #[`item.details`]="{ item }">
          <v-list-item-subtitle>
            İletişim: {{ getCompanyById(item.companyId)?.contactInformation || 'Bilinmeyen İletişim' }}<br>
            Sektör: {{ getCompanyById(item.companyId)?.sector || 'Bilinmeyen Sektör' }}
          </v-list-item-subtitle>
        </template>

        <template #[`item.actions`]="{ item }">
          <v-btn color="primary" icon @click.stop="selectWinner(item.tenderId, item.id)">
            <v-icon>mdi-check</v-icon> Kazananı Seç
          </v-btn>
        </template>
      </v-data-table>
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
      selectedTenderOffers: null,
      finishedTendersHeaders: [
        { text: 'İhale Başlığı', value: 'title' },
        { text: 'Kazanan Şirket', value: 'companyName' },
        { text: 'Kazanan Teklif Miktarı', value: 'awardedAmount' },
        { text: 'Detaylar', value: 'details' }
      ],
      tenderHeaders: [
        { text: 'İhale Başlığı', value: 'title' },
        { text: 'Başlangıç Tarihi', value: 'startDate' },
        { text: 'Bitiş Tarihi', value: 'endDate' },
        { text: 'Açıklama ve Ürünler', value: 'details' },
        { text: 'İşlemler', value: 'actions', sortable: false }
      ],
      offerHeaders: [
        { text: 'Şirket Adı', value: 'companyName' },
        { text: 'Teklif Miktarı', value: 'amount' },
        { text: 'Detaylar', value: 'details' },
        { text: 'İşlemler', value: 'actions', sortable: false }
      ]
    }
  },
  computed: {
    ...mapGetters({
      getTenders: 'tender/getTenders',
      getFinishedTenders: 'tender/getFinishedTenders',
      getOffersByTenderId: 'offer/getOffersByTenderId',
      getCompanyById: 'company/getCompanyById',
      getTenderById: 'tender/getTenderById',
      getTenderProductsByTenderId: 'tenderProduct/getTenderProductsByTenderId',
      getProductById: 'product/getProductById'
    }),
    getActiveTenders () {
      return this.getTenders.filter(tender => !tender.isFinished)
    }
  },
  async created () {
    await this.loadData()
  },
  methods: {
    async loadData () {
      try {
        await this.$store.dispatch('tender/fetchTenders')
        await this.$store.dispatch('offer/fetchOffers')
        await this.$store.dispatch('company/fetchCompanies')
        await this.$store.dispatch('tenderProduct/fetchTenderProducts')
        await this.$store.dispatch('product/fetchProducts')
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error)
      } finally {
        this.loading = false
      }
    },
    toggleOffers (tenderId) {
      this.selectedTenderOffers = this.getOffersByTenderId(tenderId)
    },
    async selectWinner (tenderId, offerId) {
      if (!tenderId || !offerId) {
        console.error('TenderId veya OfferId geçersiz:', { tenderId, offerId })
        return
      }

      const offers = this.getOffersByTenderId(tenderId)

      if (!offers || offers.length === 0) {
        console.error(`Teklifler bulunamadı: tenderId ${tenderId}`)
        return
      }

      const winningOffer = offers.find(offer => offer.id === offerId)

      if (!winningOffer) {
        console.error(`Kazanan teklif bulunamadı: offerId ${offerId}`)
        return
      }

      const tender = this.$store.getters['tender/getTenderById'](tenderId)

      const productIds = this.getTenderProductsByTenderId(tenderId).map(product => product.productId) || []

      if (productIds.length === 0) {
        console.error('ProductIds eksik, ürünler bulunamadı.')
        return
      }

      const updatedTender = {
        ...tender,
        title: tender.title || 'Başlık Eksik',
        tenderType: tender.tenderType || 'OpenTender',
        description: tender.description || 'Açıklama Yok',
        productIds,
        isFinished: true,
        unitId: tender.unit?.id || null,
        winnerCompanyId: winningOffer.companyId,
        awardedAmount: winningOffer.amount
      }

      try {
        await this.$store.dispatch('tender/updateTender', updatedTender)

        offers.forEach(async (offer) => {
          if (offer.id !== offerId) {
            await this.$store.dispatch('tender/updateTender', {
              ...tender,
              winnerCompanyId: offer.companyId,
              awardedAmount: -offer.amount
            })
          }
        })

        await this.loadData()
        this.selectedTenderOffers = null
      } catch (error) {
        console.error('Kazananı seçerken hata oluştu:', error)
      }
    }
  }
}
</script>
