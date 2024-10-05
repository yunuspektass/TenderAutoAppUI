<template>
  <v-container v-if="!loading" fluid>
    <v-card>
      <v-card-title>
        Firma Yönetimi
        <v-spacer />
        <v-btn color="primary" @click="openAddCompanyDialog">
          Yeni Firma Ekle
        </v-btn>
      </v-card-title>
      <v-card-subtitle>
        Firmaları görüntüleyebilir, ekleyebilir, düzenleyebilir ve silebilirsiniz.
      </v-card-subtitle>
      <v-data-table
        :headers="headers"
        :items="companies"
        class="elevation-1"
        item-value="id"
      >
        <template #[`item.actions`]="{ item }">
          <v-btn icon color="primary" @click="openEditCompanyDialog(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon color="red" @click="deleteCompany(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>

        <template #[`expanded-item`]="{ headers, item }">
          <td :colspan="headers.length">
            <v-list dense>
              <v-list-item v-for="tender in getTendersByCompany(item.id)" :key="tender.id">
                <v-list-item-content>{{ tender.title }} - {{ tender.budget | formatCurrency }}</v-list-item-content>
              </v-list-item>
            </v-list>
          </td>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ dialogTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="formValid">
            <v-text-field
              v-model="company.companyName"
              label="Firma Adı"
              :rules="[v => !!v || 'Firma adı zorunludur']"
              required
            />
            <v-text-field
              v-model="company.address"
              label="Adres"
              :rules="[v => !!v || 'Adres zorunludur']"
              required
            />
            <v-text-field
              v-model="company.contactInformation"
              label="İletişim Bilgileri"
              :rules="[v => !!v || 'İletişim bilgileri zorunludur']"
              required
            />
            <v-text-field
              v-model="company.taxNumber"
              label="Vergi Numarası"
              :rules="[v => !!v || 'Vergi numarası zorunludur']"
              required
            />
            <v-text-field
              v-model="company.sector"
              label="Sektör"
              :rules="[v => !!v || 'Sektör zorunludur']"
              required
            />
            <v-select
              v-model="company.tenderIds"
              :items="availableTenders"
              item-text="title"
              item-value="id"
              label="İhaleler"
              multiple
              :rules="[v => !!v.length || 'En az bir ihale seçilmelidir']"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="closeDialog">
            İptal
          </v-btn>
          <v-btn color="blue darken-1" text :disabled="!formValid" @click="saveCompany">
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
export default {
  data () {
    return {
      dialog: false,
      dialogTitle: '',
      formValid: false,
      loading: true,
      company: {
        id: null,
        companyName: '',
        address: '',
        contactInformation: '',
        taxNumber: '',
        sector: '',
        tenderIds: []
      },
      headers: [
        { text: 'Firma Adı', value: 'companyName' },
        { text: 'Adres', value: 'address' },
        { text: 'İletişim Bilgileri', value: 'contactInformation' },
        { text: 'Vergi Numarası', value: 'taxNumber' },
        { text: 'Sektör', value: 'sector' },
        { text: 'İşlemler', value: 'actions', sortable: false }
      ]
    }
  },
  computed: {
    companies () {
      return this.$store.getters['company/getCompanies']
    },
    companyTenders () {
      return this.$store.getters['companyTender/getCompanyTenders']
    },
    availableTenders () {
      return this.$store.getters['tender/getTenders']
    }
  },
  async created () {
    await this.initializeData()
    this.loading = false // Veriler yüklendikten sonra loading false yapılır
  },
  methods: {
    async initializeData () {
      try {
        await this.$store.dispatch('company/fetchCompanies')
        await this.$store.dispatch('companyTender/fetchCompanyTenders')
        await this.$store.dispatch('tender/fetchTenders')
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error)
      }
    },
    getTendersByCompany (companyId) {
      return this.companyTenders
        .filter(tender => tender.company.id === companyId)
        .map(tender => tender.tender)
    },
    openAddCompanyDialog () {
      this.dialogTitle = 'Yeni Firma Ekle'
      this.resetCompanyData()
      this.dialog = true
    },
    openEditCompanyDialog (company) {
      this.dialogTitle = 'Firmayı Düzenle'
      this.company = {
        ...company,
        tenderIds: this.getTendersByCompany(company.id).map(tender => tender.id)
      }
      this.dialog = true
    },
    resetCompanyData () {
      this.company = {
        id: null,
        companyName: '',
        address: '',
        contactInformation: '',
        taxNumber: '',
        sector: '',
        tenderIds: []
      }
    },
    closeDialog () {
      this.dialog = false
    },
    async saveCompany () {
      if (this.$refs.form.validate()) {
        if (this.company.id) {
          await this.$store.dispatch('company/updateCompany', this.company)
        } else {
          await this.$store.dispatch('company/addCompany', this.company)
        }
        await this.fetchUpdatedData()
        this.closeDialog()
      }
    },
    async deleteCompany (id) {
      await this.$store.dispatch('company/deleteCompany', id)
      await this.fetchUpdatedData()
    },
    async fetchUpdatedData () {
      await this.$store.dispatch('company/fetchCompanies')
      await this.$store.dispatch('companyTender/fetchCompanyTenders')
      await this.$store.dispatch('tender/fetchTenders')
    }
  }
}
</script>
