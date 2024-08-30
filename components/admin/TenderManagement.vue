<template>
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

    <v-data-table
      :headers="headers"
      :items="tenders"
      class="elevation-1"
      item-value="id"
    >
      <template #[`item.tenderType`]="{ item }">
        {{ getTenderTypeLabel(item.tenderType) }}
      </template>

      <template #[`item.unit`]="{ item }">
        {{ item.unit.unitName }}
      </template>

      <template #[`item.actions`]="{ item }">
        <v-btn icon color="primary" @click="openEditTenderDialog(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon color="red" @click="deleteTender(item.id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>

      <template #[`item.budget`]="{ item }">
        {{ item.budget | formatCurrency }}
      </template>

      <template #[`item.startDate`]="{ item }">
        {{ item.startDate | formatDate }}
      </template>

      <template #[`item.endDate`]="{ item }">
        {{ item.endDate | formatDate }}
      </template>

      <template #[`item.responsibles`]="{ item }">
        <v-expansion-panels flat>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Sorumluları Görüntüle
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div v-for="userTender in getUserTendersByTenderId(item.id)" :key="userTender.id">
                {{ getUserById(userTender.userId) }}
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>

      <template #[`item.products`]="{ item }">
        <v-expansion-panels flat>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Ürünleri Görüntüle
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div v-for="product in getTenderProductsByTenderId(item.id)" :key="product.productId">
                {{ getProductById(product.productId) }}
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="600px">
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
            <v-select
              v-model="tender.productIds"
              :items="products"
              item-text="productName"
              item-value="id"
              label="Ürün Seç"
              :rules="[v => v.length || 'En az bir ürün seçilmelidir']"
              multiple
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
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
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
        productIds: []
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
      ]
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
  created () {
    this.$store.dispatch('tender/fetchTenders')
    this.$store.dispatch('product/fetchProducts')
    this.$store.dispatch('unit/fetchUnits')
    this.$store.dispatch('user/fetchUsers')
    this.$store.dispatch('userTender/fetchUserTenders')
    this.$store.dispatch('tenderProduct/fetchTenderProducts')
  },
  methods: {
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
        startDate: tender.startDate,
        endDate: tender.endDate,
        budget: tender.budget,
        tenderType: tender.tenderType,
        unitId: tender.unit.id,
        userIds: this.getUserTendersByTenderId(tender.id).map(userTender => userTender.userId) || [],
        productIds: this.getTenderProductsByTenderId(tender.id).map(product => product.productId) || []
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
        productIds: []
      }
    },
    closeDialog () {
      this.dialog = false
    },
    async saveTender () {
      this.tender.startDate = moment(this.tender.startDate).utc().format()
      this.tender.endDate = moment(this.tender.endDate).utc().format()

      if (this.$refs.form.validate()) {
        if (this.tender.id) {
          this.$store.dispatch('tender/updateTender', this.tender)
        } else {
          this.$store.dispatch('tender/addTender', this.tender)
        }
        await this.fetchUpdatedData()
        this.closeDialog()
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
