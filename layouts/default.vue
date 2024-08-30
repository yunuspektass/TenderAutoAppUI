<template>
  <v-app>
    <!-- Üst Navigasyon -->
    <v-app-bar app color="indigo" dark>
      İhale Yönetim Sistemi

      <v-spacer />

      <ProfileMenu v-if="$auth.loggedIn" />
    </v-app-bar>

    <!-- Admin Navigation -->
    <AdminNavigation v-if="isRole('Admin')" />

    <!-- Tender Responsible Navigation -->
    <TenderResponsibleNavigation v-if="isRole('TenderResponsible')" />

    <!-- Company User Navigation -->
    <CompanyUserNavigation v-if="isRole('CompanyUser')" />

    <!-- General User Navigation -->
    <UserNavigation v-if="isRole('User')" />

    <!-- İçerik -->
    <v-main>
      <nuxt />
    </v-main>

    <!-- Footer -->
    <FooterComponent />
  </v-app>
</template>

<script>
import AdminNavigation from '@/components/navigation/AdminNavigation.vue'
import TenderResponsibleNavigation from '@/components/navigation/TenderResponsibleNavigation.vue'
import CompanyUserNavigation from '@/components/navigation/CompanyUserNavigation.vue'
import UserNavigation from '@/components/navigation/UserNavigation.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import ProfileMenu from '~/components/navigation/ProfileMenu.vue'

export default {
  components: {
    AdminNavigation,
    TenderResponsibleNavigation,
    CompanyUserNavigation,
    UserNavigation,
    FooterComponent,
    ProfileMenu
  },
  computed: {
    roles () {
      return this.$store.getters.roles
    },
    isRole () {
      return role => this.roles.includes(role)
    }
  }
}
</script>
