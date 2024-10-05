<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        Açık İhaleler
      </v-card-title>
      <v-card-subtitle>
        Bu sayfada devam eden ihaleleri görüntüleyebilirsiniz.
      </v-card-subtitle>

      <v-data-table
        :headers="headers"
        :items="openTenders"
        :search="search"
        class="elevation-1"
      >
        <template #[`item.tenderType`]="{ item }">
          {{ getTenderTypeLabel(item.tenderType) }}
        </template>

        <template #[`item.unit`]="{ item }">
          {{ item.unit.unitName }}
        </template>

        <template #[`item.products`]="{ item }">
          <div v-if="getTenderProductsByTenderId(item.id).length">
            <v-list dense>
              <v-list-item
                v-for="product in getTenderProductsByTenderId(item.id)"
                :key="product.id"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    {{ getProductById(product.productId) }} - Miktar: {{ product.quantity }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
          <div v-else>
            Ürün yok
          </div>
        </template>

        <!-- Başlangıç Tarihi -->
        <template #[`item.startDate`]="{ item }">
          {{ item.startDate | formatDate }}
        </template>

        <!-- Bitiş Tarihi -->
        <template #[`item.endDate`]="{ item }">
          {{ item.endDate | formatDate }}
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      search: '',
      headers: [
        { text: 'Başlık', value: 'title' },
        { text: 'Açıklama', value: 'description' },
        { text: 'Başlangıç Tarihi', value: 'startDate' },
        { text: 'Bitiş Tarihi', value: 'endDate' },
        { text: 'Ürünler', value: 'products', sortable: false },
        { text: 'Birim', value: 'unit.unitName', sortable: false },
        { text: 'İhale Türü', value: 'tenderType', sortable: false }
      ],
      tenderTypes: [
        { value: 'OpenTender', label: 'Açık İhale' },
        { value: 'ClosedTender', label: 'Kapalı İhale' },
        { value: 'InvitedTender', label: 'Davetli İhale' },
        { value: 'NegotiationProcedure', label: 'Pazarlık Usulü' }
      ]
    }
  },
  computed: {
    ...mapGetters({
      tenders: 'tender/getTenders',
      getTenderProductsByTenderId: 'tenderProduct/getTenderProductsByTenderId',
      products: 'product/getProducts'
    }),
    openTenders () {
      return this.tenders.filter(tender => tender.isFinished === false)
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      try {
        await this.$store.dispatch('tender/fetchTenders')
        await this.$store.dispatch('tenderProduct/fetchTenderProducts')
        await this.$store.dispatch('product/fetchProducts')
      } catch (error) {
        console.error('Verileri çekerken hata oluştu:', error)
      }
    },
    getTenderTypeLabel (tenderType) {
      const type = this.tenderTypes.find(type => type.value === tenderType)
      return type ? type.label : 'Bilinmeyen İhale Türü'
    },
    getProductById (productId) {
      const product = this.products.find(product => product.id === productId)
      return product ? product.productName : 'Bilinmeyen Ürün'
    }
  }
}
</script>
