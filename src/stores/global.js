import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const useGlobalStore = defineStore('global', {
  state: () => ({
    collapsed: localStorage.getItem('sidebarCollapsed') === 'true',
    theme: localStorage.getItem('theme') || 'light',
    drawerSearchActive: false,
    userData: null,
    userCredits: 0,
    miniScreenCollapsed: false,
    totalCredits: 2000,
    snapshotSettings: null,
    defaultTab: 'Business Overview',
    collapseValueTrigger: null,
    selectedValueTriggerName: null,
    isArgusAIActive: false,
    localSelectedValue: null,
    selectedPeriod: 30,
    lastActiveKey: 'dashboard',
    refreshSearchData: false
  }),
  getters: {
    creditPercentage: (state) => {
      return (state.userCredits / state.totalCredits) * 100
    }
  },
  actions: {
    toggleArgusAIActive() {
      this.isArgusAIActive = !this.isArgusAIActive
    },
    toggleCollapsed() {
      this.collapsed = !this.collapsed
      localStorage.setItem('sidebarCollapsed', this.collapsed)
    },
    toggleDrawerSearch() {
      this.drawerSearchActive = !this.drawerSearchActive
    },
    toggleMiniScreenCollapsed() {
      this.miniScreenCollapsed = !this.miniScreenCollapsed
    },
    async fetchUserData(token) {
      try {
        const response = await useApi().get('/users', {}, token)
        this.userData = response.data
        this.userCredits = response.data.credit
      } catch (error) {
        throw error
      }
    },
    setSnapshotSettings(settings) {
      this.snapshotSettings = settings
      localStorage.setItem('snapshotSettings', JSON.stringify(settings))
    },
    setLastActiveKey(key) {
      this.lastActiveKey = key
    },
    setRefreshSearchData(value) {
      this.refreshSearchData = value
    }
  }
})
