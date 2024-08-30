<template>
  <v-card>
    <v-card-title>
      Birim Yönetimi
      <v-spacer />
      <v-btn color="primary" @click="openAddUnitDialog">
        Yeni Birim Ekle
      </v-btn>
    </v-card-title>
    <v-card-subtitle>
      Birimleri görüntüleyebilir, ekleyebilir, düzenleyebilir ve silebilirsiniz.
    </v-card-subtitle>
    <v-data-table
      :headers="headers"
      :items="units"
      class="elevation-1"
      item-value="id"
    >
      <template #[`item.actions`]="{ item }">
        <v-btn icon color="primary" @click="openEditUnitDialog(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon color="red" @click="deleteUnit(item.id)">
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
              v-model="unit.unitName"
              label="Birim Adı"
              :rules="[v => !!v || 'Birim adı zorunludur']"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="closeDialog">
            İptal
          </v-btn>
          <v-btn color="blue darken-1" text :disabled="!formValid" @click="saveUnit">
            Kaydet
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  data () {
    return {
      dialog: false,
      dialogTitle: '',
      formValid: false,
      unit: {
        id: null,
        unitName: ''
      },
      headers: [
        { text: 'Birim Adı', value: 'unitName' },
        { text: 'İşlemler', value: 'actions', sortable: false }
      ]
    }
  },
  computed: {
    units () {
      const units = this.$store.getters['unit/getUnits']
      return Array.isArray(units) ? units : []
    }
  },
  created () {
    this.$store.dispatch('unit/fetchUnits')
  },
  methods: {
    openAddUnitDialog () {
      this.dialogTitle = 'Yeni Birim Ekle'
      this.resetUnitData()
      this.dialog = true
    },
    openEditUnitDialog (unit) {
      this.dialogTitle = 'Birimi Düzenle'
      this.unit = { ...unit }
      this.dialog = true
    },
    resetUnitData () {
      this.unit = {
        id: null,
        unitName: ''
      }
    },
    closeDialog () {
      this.dialog = false
    },
    async saveUnit () {
      if (this.$refs.form.validate()) {
        try {
          if (this.unit.id) {
            await this.$store.dispatch('unit/updateUnit', this.unit)
            await this.$store.dispatch('unit/fetchUnitById', this.unit.id)
          } else {
            await this.$store.dispatch('unit/addUnit', this.unit)
            await this.$store.dispatch('unit/fetchUnitById', this.unit.id)
          }
        } catch (error) {
          console.error('Birim kaydedilirken hata:', error)
        } finally {
          this.closeDialog()
        }
      }
    },

    async deleteUnit (id) {
      try {
        await this.$store.dispatch('unit/deleteUnit', id)
        await this.$store.dispatch('unit/fetchUnits')
      } catch (error) {
        console.error('Birim silinirken hata:', error)
      }
    }
  }
}
</script>
