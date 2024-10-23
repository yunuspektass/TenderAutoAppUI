<template>
  <v-container v-if="!loading" fluid>
    <v-card>
      <v-card-title>
        Kategori Yönetimi
        <v-spacer />
        <v-btn color="primary" @click="openAddCategoryDialog">
          Yeni Kategori Ekle
        </v-btn>
      </v-card-title>
      <v-card-subtitle>
        Kategorileri görüntüleyebilir, ekleyebilir, düzenleyebilir ve silebilirsiniz.
      </v-card-subtitle>
      <v-data-table
        :headers="headers"
        :items="categories"
        class="elevation-1"
        item-value="id"
      >
        <template #[`item.actions`]="{ item }">
          <v-btn icon color="primary" @click="openEditCategoryDialog(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon color="red" @click="deleteCategory(item.id)">
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
                v-model="category.categoryName"
                label="Kategori Adı"
                :rules="[v => !!v || 'Kategori adı zorunludur']"
                required
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" text @click="closeDialog">
              İptal
            </v-btn>
            <v-btn color="blue darken-1" text :disabled="!formValid" @click="saveCategory">
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
      category: {
        id: null,
        categoryName: ''
      },
      headers: [
        { text: 'Kategori Adı', value: 'categoryName' },
        { text: 'İşlemler', value: 'actions', sortable: false }
      ]
    }
  },
  computed: {
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
        await this.$store.dispatch('category/fetchCategories')
      } catch (error) {
        console.error('Kategoriler yüklenirken hata oluştu:', error)
      } finally {
        this.loading = false
      }
    },
    openAddCategoryDialog () {
      this.dialogTitle = 'Yeni Kategori Ekle'
      this.resetCategoryData()
      this.dialog = true
    },
    openEditCategoryDialog (category) {
      this.dialogTitle = 'Kategoriyi Düzenle'
      this.category = { ...category }
      this.dialog = true
    },
    resetCategoryData () {
      this.category = {
        id: null,
        categoryName: ''
      }
    },
    closeDialog () {
      this.dialog = false
      this.resetCategoryData()
    },
    async saveCategory () {
      if (this.$refs.form.validate()) {
        try {
          if (this.category.id) {
            await this.$store.dispatch('category/updateCategory', this.category)
            console.log('Kategori başarıyla güncellendi.')
          } else {
            await this.$store.dispatch('category/addCategory', this.category)
            console.log('Kategori başarıyla eklendi.')
          }
          await this.$store.dispatch('category/fetchCategories')
        } catch (error) {
          console.error('Kategori kaydedilirken hata:', error)
        } finally {
          this.closeDialog()
        }
      }
    },
    async deleteCategory (id) {
      try {
        await this.$store.dispatch('category/deleteCategory', id)
        await this.$store.dispatch('category/fetchCategories')
        console.log('Kategori başarıyla silindi.')
      } catch (error) {
        console.error('Kategori silinirken hata:', error)
      }
    }
  }
}
</script>
