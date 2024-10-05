<template>
  <v-container v-if="!loading" fluid>
    <v-card>
      <v-card-title>
        Ürün Yönetimi
        <v-spacer />
        <v-btn color="primary" @click="openAddProductDialog">
          Yeni Ürün Ekle
        </v-btn>
      </v-card-title>
      <v-card-subtitle>
        Ürünleri görüntüleyebilir, ekleyebilir, düzenleyebilir ve silebilirsiniz.
      </v-card-subtitle>
      <v-data-table
        :headers="headers"
        :items="products"
        class="elevation-1"
        item-value="id"
      >
        <template #[`item.actions`]="{ item }">
          <v-btn icon color="primary" @click="openEditProductDialog(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon color="red" @click="deleteProduct(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
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
                v-model="product.productName"
                label="Ürün Adı"
                :rules="[v => !!v || 'Ürün adı zorunludur']"
                required
              />
              <v-select
                v-model="product.category"
                :items="categories"
                item-text="categoryName"
                item-value="id"
                label="Kategori"
                :rules="[v => !!v || 'Kategori seçilmelidir']"
                required
              />
              <v-textarea
                v-model="product.description"
                label="Açıklama"
                :rules="[v => !!v || 'Açıklama zorunludur']"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" text @click="closeDialog">
              İptal
            </v-btn>
            <v-btn color="blue darken-1" text :disabled="!formValid" @click="saveProduct">
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
export default {
  data () {
    return {
      loading: true,
      dialog: false,
      dialogTitle: '',
      formValid: false,
      product: {
        id: null,
        productName: '',
        category: '',
        description: ''
      },
      headers: [
        { text: 'Ürün Adı', value: 'productName' },
        { text: 'Kategori', value: 'category.categoryName' },
        { text: 'İşlemler', value: 'actions', sortable: false }
      ]
    }
  },
  computed: {
    products () {
      const products = this.$store.getters['product/getProducts']
      return Array.isArray(products) ? products : []
    },
    categories () {
      return this.$store.getters['category/getCategories']
    }
  },
  created () {
    this.initializeData()
  },
  methods: {
    async initializeData () {
      try {
        await this.$store.dispatch('product/fetchProducts')
        await this.$store.dispatch('category/fetchCategories')
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error)
      } finally {
        this.loading = false
      }
    },
    openAddProductDialog () {
      this.dialogTitle = 'Yeni Ürün Ekle'
      this.resetProductData()
      this.dialog = true
    },
    openEditProductDialog (product) {
      this.dialogTitle = 'Ürünü Düzenle'
      this.product = { ...product, category: product.category.id }
      this.dialog = true
    },
    resetProductData () {
      this.product = {
        id: null,
        productName: '',
        category: '',
        description: ''
      }
    },
    closeDialog () {
      this.dialog = false
    },
    async saveProduct () {
      if (this.$refs.form.validate()) {
        try {
          if (this.product.id) {
            await this.$store.dispatch('product/updateProduct', this.product)
          } else {
            await this.$store.dispatch('product/addProduct', this.product)
          }
          await this.$store.dispatch('product/fetchProducts')
        } catch (error) {
          console.error('Ürün kaydedilirken hata:', error)
        } finally {
          this.closeDialog()
        }
      }
    },
    async deleteProduct (id) {
      try {
        await this.$store.dispatch('product/deleteProduct', id)
        await this.$store.dispatch('product/fetchProducts')
      } catch (error) {
        console.error('Ürün silinirken hata:', error)
      }
    }
  }
}
</script>
