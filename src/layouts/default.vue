<template>
  <div v-if="isLoginPage">
    <RouterView />
  </div>
  <div v-else class="main-layout">
    <div class="header">
      <app-header />
    </div>
    <div class="sidebar">
      <app-sidebar />
    </div>
    <div class="main-content">
      <RouterView />
    </div>
  </div>
</template>
<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useGlobalStore } from '@/stores/global'

const route = useRoute()
const isLoginPage = computed(() => route.path === '/login')

const globalStore = useGlobalStore()
const collapsed = computed(() => globalStore.collapsed)
</script>
<style>
.main-layout {
  background: var(--background-color);
  z-index: 100 !important;
}
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: var(--background-color);
  /* color: var(--color); */
  padding: 1rem;
  z-index: 100 !important;
}

.sidebar {
  position: fixed;
  top: 60px;
  left: 0;
  bottom: 0;
  background: var(--background-color);
}

.main-content {
  margin-left: v-bind(collapsed ? '64px': '180px');
  margin-top: 60px;
  background: var(--background-color-sec);
  min-height: calc(100vh - 60px);
  border-radius: 40px 0px 0px 0px;
  padding: 1rem;
  z-index: 10 !important;
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
  .main-layout {
    background: var(--background-color-sec);
  }
  .main-content {
    margin-left: 0;
  }
}

:deep(.n-drawer.n-drawer--top-placement) {
  top: 60px !important;
}
</style>
