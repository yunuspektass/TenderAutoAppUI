<template>
  <div>
    <v-container v-if="loading" fluid class="d-flex align-center justify-center" style="height: 100vh">
      <v-row align="center" justify="center">
        <v-progress-circular indeterminate color="primary" />
      </v-row>
    </v-container>

    <template v-else>
      <v-navigation-drawer
        app
        color="indigo"
        dark
        :permanent="$vuetify.breakpoint.mdAndUp"
        :temporary="$vuetify.breakpoint.smAndDown"
        v-model="drawer"
      >
        <v-list dense>
          <v-subheader class="white--text d-flex align-center">
            Firma İşlemleri
            <v-select
              v-model="selectedCompanyId"
              :items="userCompanies"
              item-text="companyName"
              item-value="companyId"
              dense
              dark
              hide-details
              class="ml-2 mt-1 company-select"
              :menu-props="{ maxHeight: '400px', offsetY: true }"
              @change="selectCompany"
            >
              <template v-slot:selection="{ item }">
                <span class="white--text">{{ item.companyName }}</span>
              </template>
              <template v-slot:item="{ item }">
                <v-list-item-content>
                  <v-list-item-title>{{ item.companyName }}</v-list-item-title>
                </v-list-item-content>
              </template>
            </v-select>
          </v-subheader>

          <v-list-item v-for="item in menuItems" :key="item.title" :to="item.to">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        class="d-md-none white--text"
        style="position: fixed; top: 8px; left: 8px; z-index: 1000;"
        v-show="!drawer"
      >
        <v-icon color="white">mdi-menu</v-icon>
      </v-app-bar-nav-icon>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      loading: true,
      selectedCompanyId: null,
      drawer: null,
      menuItems: [
        { title: 'Ana Sayfa', icon: 'mdi-home', to: '/company/dashboard' },
        { title: 'İhale Teklif Yönetimi', icon: 'mdi-gavel', to: '/company/tender-participation' },
        { title: 'Firma Profil Yönetimi', icon: 'mdi-account-circle', to: '/company/profile-update' },
        { title: 'İhale ve Şirket Detayları', icon: 'mdi-trophy', to: '/company/won-tenders' }
      ]
    }
  },
  computed: {
    ...mapGetters({
      getUserCompaniesByUserId: 'userCompany/getUserCompaniesByUserId',
      getCompanyById: 'company/getCompanyById',
      getSelectedCompanyId: 'selectedCompany/getSelectedCompanyId'
    }),
    currentUser () {
      return this.$auth.user || null
    },
    userCompanies () {
      if (this.currentUser && !this.loading) {
        const userCompanies = this.getUserCompaniesByUserId(this.currentUser.id)
        return userCompanies.map((uc) => {
          const company = this.getCompanyById(uc.companyId)
          return {
            companyId: uc.companyId,
            companyName: company ? company.companyName : 'Bilinmeyen Şirket'
          }
        }).filter(company => company.companyName !== 'Bilinmeyen Şirket')
      }
      return []
    }
  },
  async created () {
    await this.initializeData()
  },
  mounted () {
    this.drawer = this.$vuetify.breakpoint.mdAndUp
  },
  methods: {
    async initializeData () {
      try {
        this.loading = true
        await this.$store.dispatch('userCompany/fetchUserCompanies')
        await this.$store.dispatch('company/fetchCompanies')
        this.selectedCompanyId = this.getSelectedCompanyId || (this.userCompanies[0] && this.userCompanies[0].companyId)
        if (this.selectedCompanyId) {
          await this.$store.dispatch('selectedCompany/setSelectedCompanyId', this.selectedCompanyId)
        }
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error)
      } finally {
        this.loading = false
      }
    },
    selectCompany (companyId) {
      this.$store.dispatch('selectedCompany/setSelectedCompanyId', companyId)
    }
  }
}
</script>

<style scoped>
.company-select {
  max-width: 200px;
}
</style>
