<template>
  <v-container v-if="!loading" fluid>
    <v-card>
      <v-card-title>
        İhale Yönetimi
        <v-spacer />
        <v-btn color="primary" @click="openAddTenderDialog">
          Yeni İhale Ekle
        </v-btn>
      </v-card-title>
      <v-card-subtitle>
        İhaleleri görüntüleyebilir, ekleyebilir, düzenleyebilir ve silebilirsiniz.
      </v-card-subtitle>

      <v-tabs v-model="activeTab" background-color="transparent" grow>
        <v-tab v-for="tender in tenders" :key="tender.id">
          {{ tender.title }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="activeTab">
        <v-tab-item v-for="tender in tenders" :key="tender.id">
          <v-card flat>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field label="Başlık" :value="tender.title" readonly />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="İhale Türü" :value="getTenderTypeLabel(tender.tenderType)" readonly />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="Başlangıç Tarihi" :value="tender.startDate | formatDate" readonly />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="Bitiş Tarihi" :value="tender.endDate | formatDate" readonly />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="Bütçe" :value="tender.budget | formatCurrency" readonly />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Birim"
                    :value="tender.unit ? tender.unit.unitName : 'Birim Belirtilmemiş'"
                    readonly
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea label="Açıklama" :value="tender.description" readonly />
                </v-col>
              </v-row>

              <v-divider class="my-4" />

              <h3>İhale Sorumluları</h3>
              <v-list dense>
                <v-list-item v-for="userTender in getUserTendersByTenderId(tender.id)" :key="userTender.id">
                  <v-list-item-content>
                    <v-list-item-title>{{ getUserById(userTender.userId) }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <v-divider class="my-4" />

              <h3>Ürünler</h3>
              <v-simple-table>
                <template #default>
                  <thead>
                    <tr>
                      <th>Ürün Adı</th>
                      <th>Miktar</th>
                      <th>Birim Fiyat</th>
                      <th>Toplam Fiyat</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="product in getTenderProductsByTenderId(tender.id)" :key="product.id">
                      <td>{{ getProductById(product.productId) }}</td>
                      <td>{{ product.quantity }}</td>
                      <td>{{ product.unitPrice | formatCurrency }}</td>
                      <td>{{ product.totalPrice | formatCurrency }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>

              <v-card-actions>
                <v-btn color="primary" @click="openEditTenderDialog(tender)">
                  Düzenle
                </v-btn>
                <v-btn color="error" @click="deleteTender(tender.id)">
                  Sil
                </v-btn>
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>

      <!-- İhale Ekle/Düzenle Dialog -->
      <v-dialog v-model="dialog" max-width="800px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ dialogTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="formValid">
              <v-text-field
                v-model="tender.title"
                label="İhale Başlığı"
                :rules="[v => !!v || 'İhale başlığı zorunludur']"
                required
              />
              <v-textarea
                v-model="tender.description"
                label="Açıklama"
                :rules="[v => !!v || 'Açıklama zorunludur']"
              />
              <v-text-field
                v-model="tender.startDate"
                label="Başlangıç Tarihi"
                type="date"
                :rules="[v => !!v || 'Başlangıç tarihi zorunludur']"
                required
              />
              <v-text-field
                v-model="tender.endDate"
                label="Bitiş Tarihi"
                type="date"
                :rules="[v => !!v || 'Bitiş tarihi zorunludur']"
                required
              />
              <v-text-field
                v-model="tender.budget"
                label="Bütçe"
                type="number"
                :rules="[v => v > 0 || 'Bütçe 0\'dan büyük olmalıdır']"
                required
              />
              <v-select
                v-model="tender.unitId"
                :items="units"
                item-text="unitName"
                item-value="id"
                label="Birim"
                :rules="[v => !!v || 'Birim seçilmelidir']"
                required
              />
              <v-select
                v-model="tender.tenderType"
                :items="tenderTypes"
                item-text="label"
                item-value="value"
                label="İhale Türü"
                :rules="[v => !!v || 'İhale türü seçilmelidir']"
                required
              />
              <v-select
                v-model="tender.userIds"
                :items="tenderResponsibleUsers"
                item-text="name"
                item-value="id"
                label="İhale Sorumlusu Seç"
                multiple
                :rules="[v => !!v || 'En az bir ihale sorumlusu seçilmelidir']"
                required
              />

              <v-divider class="my-4" />
              <v-select
                v-model="tender.productIds"
                :items="products"
                item-text="productName"
                item-value="id"
                label="Ürün Seç"
                multiple
                :rules="[v => v.length > 0 || 'En az bir ürün seçilmelidir']"
                required
              />

              <v-text-field
                v-model="tender.quantity"
                label="Miktar"
                type="number"
                :rules="[v => v > 0 || 'Miktar 0\'dan büyük olmalıdır']"
                required
              />
              <v-text-field
                v-model="tender.unitPrice"
                label="Birim Fiyat"
                type="number"
                :rules="[v => v >= 0 || 'Birim fiyat negatif olamaz']"
                required
              />
              <v-text-field
                v-model="tender.totalPrice"
                label="Toplam Fiyat"
                type="number"
                :rules="[v => v >= 0 || 'Toplam fiyat negatif olamaz']"
                required
                readonly
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" text @click="closeDialog">
              İptal
            </v-btn>
            <v-btn color="blue darken-1" text :disabled="!formValid" @click="saveTender">
              Kaydet
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>

  <v-container v-else fluid class="d-flex align-center justify-center" style="height: 100vh">
    <v-row align="center" justify="center">
      <v-progress-circular indeterminate color="primary" />
    </v-row>
  </v-container>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      loading: true,
      dialog: false,
      dialogTitle: '',
      formValid: false,
      tender: {
        id: null,
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        budget: 0,
        tenderType: null,
        unitId: null,
        userIds: [],
        productIds: [],
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0
      },
      headers: [
        { text: 'Başlık', value: 'title' },
        { text: 'Açıklama', value: 'description' },
        { text: 'Başlangıç Tarihi', value: 'startDate' },
        { text: 'Bitiş Tarihi', value: 'endDate' },
        { text: 'Bütçe', value: 'budget' },
        { text: 'Birim', value: 'unit.unitName', sortable: false },
        { text: 'İhale Türü', value: 'tenderType', sortable: false },
        { text: 'İhale Sorumlusu', value: 'responsibles', sortable: false },
        { text: 'Ürünler', value: 'products', sortable: false },
        { text: 'İşlemler', value: 'actions', sortable: false }
      ],
      tenderTypes: [
        { value: 'OpenTender', label: 'Açık İhale' },
        { value: 'ClosedTender', label: 'Kapalı İhale' },
        { value: 'InvitedTender', label: 'Davetli İhale' },
        { value: 'NegotiationProcedure', label: 'Pazarlık Usulü' }
      ],
      activeTab: null
    }
  },
  computed: {
    ...mapGetters({
      tenders: 'tender/getTenders',
      products: 'product/getProducts',
      units: 'unit/getUnits',
      getUsers: 'user/getUsers',
      getUserTendersByTenderId: 'userTender/getUserTendersByTenderId',
      getTenderProductsByTenderId: 'tenderProduct/getTenderProductsByTenderId'
    }),
    tenderResponsibleUsers () {
      return this.getUsers.map(user => ({
        id: user.id,
        name: user.name
      }))
    }
  },
  watch: {
    'tender.quantity': 'calculateTotalPrice',
    'tender.unitPrice': 'calculateTotalPrice'
  },
  created () {
    this.initializeData()
  },
  methods: {
    async initializeData () {
      try {
        await this.$store.dispatch('tender/fetchTenders')
        await this.$store.dispatch('product/fetchProducts')
        await this.$store.dispatch('unit/fetchUnits')
        await this.$store.dispatch('user/fetchUsers')
        await this.$store.dispatch('userTender/fetchUserTenders')
        await this.$store.dispatch('tenderProduct/fetchTenderProducts')
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error)
      } finally {
        this.loading = false
      }
    },
    getUserById (id) {
      const user = this.getUsers.find(user => user.id === id)
      return user ? user.name : 'Bilinmeyen Kullanıcı'
    },
    getProductById (id) {
      const product = this.products.find(product => product.id === id)
      return product ? product.productName : 'Bilinmeyen Ürün'
    },
    getTenderTypeLabel (tenderType) {
      const type = this.tenderTypes.find(type => type.value === tenderType)
      return type ? type.label : 'Bilinmeyen İhale Türü'
    },
    openAddTenderDialog () {
      this.dialogTitle = 'Yeni İhale Ekle'
      this.resetTenderData()
      this.dialog = true
    },
    openEditTenderDialog (tender) {
      this.dialogTitle = 'İhaleyi Düzenle'
      this.tender = {
        id: tender.id,
        title: tender.title,
        description: tender.description || '',
        startDate: moment(tender.startDate).format('YYYY-MM-DD'),
        endDate: moment(tender.endDate).format('YYYY-MM-DD'),
        budget: tender.budget,
        tenderType: tender.tenderType,
        unitId: tender.unit ? tender.unit.id : null,
        userIds: this.getUserTendersByTenderId(tender.id).map(userTender => userTender.userId) || [],
        productIds: this.getTenderProductsByTenderId(tender.id).map(product => product.productId) || [],
        quantity: tender.quantity || 1,
        unitPrice: tender.unitPrice || 0,
        totalPrice: tender.totalPrice || 0
      }
      this.dialog = true
    },
    resetTenderData () {
      this.tender = {
        id: null,
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        budget: 0,
        tenderType: null,
        unitId: null,
        userIds: [],
        productIds: [],
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0
      }
    },
    closeDialog () {
      this.dialog = false
    },
    calculateTotalPrice () {
      this.tender.totalPrice = this.tender.quantity * this.tender.unitPrice
    },
    async saveTender () {
      if (this.$refs.form.validate()) {
        // Tarih formatlarını düzenle
        this.tender.startDate = moment(this.tender.startDate).utc().format()
        this.tender.endDate = moment(this.tender.endDate).utc().format()

        try {
          if (this.tender.id) {
            await this.$store.dispatch('tender/updateTender', this.tender)
          } else {
            await this.$store.dispatch('tender/addTender', this.tender)
          }
          await this.fetchUpdatedData()
          this.closeDialog()
        } catch (error) {
          console.error('İhale kaydedilirken hata oluştu:', error)
        }
      }
    },
    async deleteTender (id) {
      this.$store.dispatch('tender/deleteTender', id)
      await this.fetchUpdatedData()
    },
    async fetchUpdatedData () {
      await this.$store.dispatch('tender/fetchTenders')
      await this.$store.dispatch('product/fetchProducts')
      await this.$store.dispatch('unit/fetchUnits')
      await this.$store.dispatch('user/fetchUsers')
      await this.$store.dispatch('userTender/fetchUserTenders')
      await this.$store.dispatch('tenderProduct/fetchTenderProducts')
    }
  }
}
</script>
