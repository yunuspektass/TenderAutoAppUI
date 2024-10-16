<template>
  <v-container v-if="!loading" fluid>
    <v-tabs v-model="activeTab" background-color="primary" dark>
      <v-tab>Sonuçlandırılmış İhaleler</v-tab>
      <v-tab>Aktif İhaleler</v-tab>
    </v-tabs>

    <v-tabs-items v-model="activeTab">
      <v-tab-item>
        <v-card flat>
          <v-card-title class="text-h5">
            Sonuçlandırılmış İhaleler
          </v-card-title>
          <v-card-subtitle>
            Kazanan teklifleri içeren sonuçlandırılmış ihaleler aşağıda gösterilmektedir.
          </v-card-subtitle>

          <v-data-table
            :headers="finishedTendersHeaders"
            :items="getFinishedUserTenders"
            class="elevation-1"
            @click:row="showTenderDetails"
          >
            <template #[`item.awardedAmount`]="{ item }">
              {{ formatAwardedAmount(item.awardedAmount) }}
            </template>

            <template #[`item.companyName`]="{ item }">
              {{ getCompanyById(item.winnerCompanyId)?.companyName || 'Bilinmeyen Şirket' }}
            </template>

            <template #[`item.details`]="{ item }">
              <v-btn color="primary" small @click.stop="showTenderDetails(item)">
                Detaylar
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-tab-item>

      <v-tab-item>
        <v-card flat>
          <v-card-title class="text-h5">
            Teklif Yönetimi
          </v-card-title>
          <v-card-subtitle>
            Aktif ihalelere verilen teklifler ve detaylar aşağıda listelenmektedir.
          </v-card-subtitle>

          <v-data-table :headers="tenderHeaders" :items="getActiveUserTenders" class="elevation-1">
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

        <v-card v-if="selectedTenderOffers" class="mt-6">
          <v-card-title class="text-h5">
            Teklifler
          </v-card-title>

          <v-data-table :headers="offerHeaders" :items="selectedTenderOffers" class="elevation-1">
            <template #[`item.companyName`]="{ item }">
              {{ getCompanyById(item.companyId)?.companyName || 'Bilinmeyen Şirket' }}
            </template>

            <template #[`item.amount`]="{ item }">
              {{ formatCurrency(item.amount) }}
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
      </v-tab-item>
    </v-tabs-items>

    <v-dialog v-model="showTenderDetailsDialog" max-width="800px">
      <v-card v-if="selectedTender">
        <v-card-title class="text-h5">
          {{ selectedTender.title }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <h3>İhale Bilgileri</h3>
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>İhale Türü</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedTender.tenderType }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Kazanan Teklif Miktarı</v-list-item-title>
                    <v-list-item-subtitle>{{ formatAwardedAmount(selectedTender.awardedAmount) }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Başlangıç Tarihi</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedTender.startDate | formatDate }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Bitiş Tarihi</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedTender.endDate | formatDate }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Açıklama</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedTender.description || 'Açıklama Yok' }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="6">
              <h3>Kazanan Şirket Bilgileri</h3>
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Şirket Adı</v-list-item-title>
                    <v-list-item-subtitle>{{ getCompanyById(selectedTender.winnerCompanyId)?.companyName || 'Bilinmeyen Şirket' }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>İletişim</v-list-item-title>
                    <v-list-item-subtitle>{{ getCompanyById(selectedTender.winnerCompanyId)?.contactInformation || 'Bilinmeyen İletişim' }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Sektör</v-list-item-title>
                    <v-list-item-subtitle>{{ getCompanyById(selectedTender.winnerCompanyId)?.sector || 'Bilinmeyen Sektör' }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="showTenderDetailsDialog = false">Kapat</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Kazanan Seçimi Onayı</v-card-title>
        <v-card-text>Bu teklifi kazanan olarak seçmek istediğinizden emin misiniz?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="confirmDialog = false">İptal</v-btn>
          <v-btn color="blue darken-1" text @click="confirmWinner">Onayla</v-btn>
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
      activeTab: 0,
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
      ],
      confirmDialog: false,
      selectedTenderId: null,
      selectedOfferId: null,
      showTenderDetailsDialog: false,
      selectedTender: null
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
      getProductById: 'product/getProductById',
      getUserTendersByUserId: 'userTender/getUserTendersByUserId'
    }),
    currentUser () {
      return this.$auth.user
    },
    userTenderIds () {
      const userTenders = this.getUserTendersByUserId(this.currentUser.id)
      return userTenders.map(userTender => userTender.tenderId)
    },
    getActiveUserTenders () {
      return this.getTenders.filter(tender => !tender.isFinished && this.userTenderIds.includes(tender.id))
    },
    getFinishedUserTenders () {
      return this.getFinishedTenders.filter(tender => this.userTenderIds.includes(tender.id))
        .map((tender) => {
          const winningOffer = this.getOffersByTenderId(tender.id)
            .find(offer => offer.companyId === tender.winnerCompanyId)
          return {
            ...tender,
            awardedAmount: winningOffer ? winningOffer.amount : null
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
        await this.$store.dispatch('tender/fetchTenders')
        await this.$store.dispatch('offer/fetchOffers')
        await this.$store.dispatch('company/fetchCompanies')
        await this.$store.dispatch('tenderProduct/fetchTenderProducts')
        await this.$store.dispatch('product/fetchProducts')
        await this.$store.dispatch('userTender/fetchUserTenders')
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error)
      } finally {
        this.loading = false
      }
    },
    toggleOffers (tenderId) {
      this.selectedTenderOffers = this.getOffersByTenderId(tenderId)
    },
    selectWinner (tenderId, offerId) {
      this.selectedTenderId = tenderId
      this.selectedOfferId = offerId
      this.confirmDialog = true
    },
    async confirmWinner () {
      this.confirmDialog = false
      await this.processWinner(this.selectedTenderId, this.selectedOfferId)
    },
    async processWinner (tenderId, offerId) {
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

      const tender = this.getTenderById(tenderId)

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

        for (const offer of offers) {
          await this.$store.dispatch('companyTender/updateOrCreateCompanyTender', {
            id: offer.id,
            companyId: offer.companyId,
            tenderId,
            awardedAmount: offer.id === offerId ? offer.amount : -offer.amount,
            productIds
          })
        }

        await this.loadData()
        this.selectedTenderOffers = null
      } catch (error) {
        console.error('Kazananı seçerken hata oluştu:', error)
      }
    },
    formatAwardedAmount (amount) {
      if (amount === null || amount === undefined) {
        return 'Veri yok'
      }
      return this.formatCurrency(amount)
    },
    formatCurrency (value) {
      return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value)
    },
    showTenderDetails (tender) {
      this.selectedTender = tender
      this.showTenderDetailsDialog = true
    }
  }
}
</script>
