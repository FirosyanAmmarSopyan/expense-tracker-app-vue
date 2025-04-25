<template>
  <div class="main-layout">
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
import { useGlobalStore } from '@/stores/global'
const globalStore = useGlobalStore()
const collapsed = computed(() => globalStore.collapsed)
</script>
<style>
.main-layout {
  background: white;
}
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: white;
  color: white;
  padding: 1rem;
  z-index: 100;
}

.sidebar {
  position: fixed;
  top: 60px;
  left: 0;
  bottom: 0;
  background: white;
}

.main-content {
  margin-left: v-bind(collapsed ? '64px': '180px');
  margin-top: 60px;
  background: #f5f5f5;
  min-height: calc(100vh - 60px);
  border-radius: 15px 0px 0px 0px;
  padding: 1rem;
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
  .main-layout {
    background: #f5f5f5;
  }
  .main-content {
    margin-left: 0;
  }
}

:deep(.n-drawer.n-drawer--top-placement) {
  top: 60px !important;
}
</style>
