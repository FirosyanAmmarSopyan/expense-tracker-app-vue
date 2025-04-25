<template>
  <n-layout has-sider>
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="180"
      :native-scrollbar="true"
      :collapsed="collapsed"
    >
      <n-menu
        :value="activeKey"
        :collapsed="collapsed"
        :collapsed-width="70"
        :collapsed-icon-size="18"
        :options="menuOptions"
      />
    </n-layout-sider>
  </n-layout>
</template>
<script setup>
import { Grid28Filled, ShieldTask48Filled } from '@vicons/fluent'
import { Albums, StatsChart, ChatbubbleOutline, CloseOutline } from '@vicons/ionicons5'
import { AttachmentSharp } from '@vicons/material'
import { ArrowRight } from '@vicons/tabler'
import { h, ref, computed, onMounted, onBeforeUnmount, inject, watch, provide } from 'vue'
import { NIcon, NImage } from 'naive-ui'
import { useGlobalStore } from '@/stores/global'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const globalStore = useGlobalStore()
const collapsed = computed(() => globalStore.collapsed)
const showChatbotModal = ref(false)
const openingChat = ref(false)
const startChat = ref(false)
const message = ref('Hello, how are you today?')

watch(
  route,
  (newRoute) => {
    const currentKey = getRouteKey(newRoute.path)
    // Only update lastActiveKey if the current route has a valid menu item
    if (currentKey !== 'unknown') {
      globalStore.setLastActiveKey(currentKey)
    }
  },
  { immediate: true }
) // Add immediate: true to handle initial route

// Pisahkan logic penentuan key ke fungsi terpisah
function getRouteKey(path) {
  if (path === '/') return 'dashboard'
  if (path === '/categories-management') return 'categories-management'
  if (path === '/expense-management') return 'expense-management'
  return 'unknown'
}

const activeKey = computed(() => {
  const currentKey = getRouteKey(route.path)
  // If current route is unknown, return lastActiveKey
  return currentKey === 'unknown' ? globalStore.lastActiveKey : currentKey
})

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

function renderImage(image) {
  return () => h(NImage, {
    src: image,
    width: 20,
    height: 20,
    previewDisabled: true
  })
}

// Add computed property for filtered menu options
const menuOptions = computed(() => {
  const baseMenuOptions = [
    {
      label: () =>
        h(
          'a',
          {
            href: '/',
            style: { color: 'inherit', textDecoration: 'none' }
          },
          'Dashboard'
        ),
      key: 'dashboard',
      icon: renderIcon(Grid28Filled)
    },
    {
      label: () =>
        h(
          'a',
          {
            href: '/categories-management',
            style: { color: 'inherit', textDecoration: 'none' }
          },
          'Categories Management'
        ),
      key: 'categories-management',
      icon: renderImage('/building-ic.svg')
    },
    {
      label: () =>
        h(
          'a',
          {
            href: '/expense-management',
            style: { color: 'inherit', textDecoration: 'none' }
          },
          'Expense Management'
        ),
      key: 'expense-management',
      icon: renderImage('/setting-ic.svg')
    }
  ]

  return baseMenuOptions
})
</script>
<style scoped>
:deep(.n-layout-sider-scroll-container) {
  background-color: var(--background-color) !important;
}

:deep(.n-layout-sider) {
  --n-border-color: var(--background-color) !important;
}

:deep(.n-menu-item-content__icon) {
  color: var(--color-default) !important;
}

:deep(
    .n-menu
      .n-menu-item-content:not(.n-menu-item-content--disabled).n-menu-item-content--selected::before
  ) {
  background-color: var(--primary-00) !important;
  border-radius: 50px;
}

:deep(.n-menu.n-menu--vertical) {
  --n-border-radius: 50px !important;
}

:deep(.n-menu .n-menu-item-content::before) {
  left: 1rem;
}

.chatbot-modal-header {
  width: 100%;
  height: 100%;
  background-color: var(--primary-20);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1rem;
  color: white;
  border-radius: 30px 30px 0 0;
}

.chatbot-modal-body {
  width: 100%;
  height: 100%;
  background-color: white;
  padding: 1.5rem 1rem;
}

.chatbot-opening-message {
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 2rem 0rem;
  gap: 1rem;
}

.chatbot-modal-footer {
  border-top: 1px solid var(--neutral-20);
}

.template-question {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.question-item {
  background-color: var(--neutral-20);
  border-radius: 500px;
  padding: 0.3rem;
  width: 100%;
  text-align: center;
}

.question-item:hover {
  background-color: #dddddd;
  cursor: pointer;
}

.chatbot-modal-footer-keyboard {
  width: 100%;
  padding: 0.5rem;
}

.keyboard-grid {
  display: grid;
  grid-template-columns: 40px 1fr 80px;
  gap: 0.5rem;
  align-items: center;
  border-radius: 8px;
  padding: 0.5rem;
}

.keyboard-column {
  display: flex;
  align-items: center;
}

.keyboard-input {
  flex: 1;
}

.keyboard-input input {
  width: 100%;
  border: none;
  background: transparent;
  padding: 0.5rem;
  outline: none;
  color: var(--text-color);
}

.keyboard-actions {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  height: 100%;
  justify-content: space-between;
}

.keyboard-button {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.keyboard-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.bubble-user {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.bubble-chatbot {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;
  gap: 0.5rem;
}

.chatbot-avatar {
  background-color: var(--primary-20);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
}

.chatbot-message {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.chatbot-name {
  font-size: 0.75rem;
  color: var(--neutral-30);
}

.bubble-content {
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.bubble-user .bubble-content {
  background-color: var(--primary-20);
  color: white;
  border-top-right-radius: 0.25rem;
}

.bubble-chatbot .bubble-content {
  background-color: var(--neutral-20);
  color: var(--text-color);
  border-top-left-radius: 0.25rem;
}

/* Add animation for new messages */
.bubble-user .bubble-content,
.bubble-chatbot .bubble-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
