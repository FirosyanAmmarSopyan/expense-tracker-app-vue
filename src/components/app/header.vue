<script setup>
import { ref, computed, h, watch, onMounted, onUnmounted } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { useGlobalStore } from '@/stores/global'
import { QuestionCircle20Regular, Grid28Filled, ShieldTask48Filled } from '@vicons/fluent'
import { LogOutOutline, PersonOutline, Albums, StatsChart } from '@vicons/ionicons5'
import { NIcon ,useNotification} from 'naive-ui'
import { useRouter } from 'vue-router'
import Credit from '../Credit.vue'
import { DehazeFilled } from '@vicons/material'
import { ChevronDown } from '@vicons/fa'
import { IosSearch, IosClose } from '@vicons/ionicons4'
const globalStore = useGlobalStore()
const router = useRouter()
const screenWidth = ref(window.innerWidth)
const headerRef = ref(null)
const route = useRoute()
const notification = useNotification()
const userData = ref(null)

const isDarkTheme = computed({
  get: () => {
    // console.log('Getting theme:', globalStore.theme)
    return globalStore.theme === 'dark'
  },
  set: (value) => {
    // console.log('Setting theme:', value ? 'dark' : 'light')
    globalStore.theme = value ? 'dark' : 'light'
    localStorage.setItem('theme', globalStore.theme) // Save theme to localStorage
  }
})



const handleToggleCollapsed = () => {
  globalStore.toggleCollapsed()
}

const handleToggleMiniScreen = () => {
  globalStore.toggleMiniScreenCollapsed()
}

// Tambahkan watch untuk screenWidth
watch(screenWidth, (newWidth) => {
  if (newWidth > 768 && globalStore.miniScreenCollapsed) {
    globalStore.toggleMiniScreenCollapsed()
  }
})

// Tambahkan event listener dengan cleanup
onMounted(() => {
  const handleResize = () => {
    screenWidth.value = window.innerWidth
  }
  window.addEventListener('resize', handleResize)

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
})

useResizeObserver(headerRef, ([entry]) => {
  screenWidth.value = entry.contentRect.width
})

const isBelow1140px = computed(() => screenWidth.value <= 1108)

// Add computed property for admin status

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

function renderCustomHeader() {
  return h(
    'div',
    {
      class: 'custom-header',
      style: {
        padding: '8px 16px'
      }
    },
    h(Credit)
  )
}

const profileOptions = computed(() => [
  ...(isBelow1140px.value
    ? [
        {
          key: 'header',
          type: 'render',
          render: renderCustomHeader
        }
      ]
    : []),
  {
    label: 'Profile',
    key: 'profile',
    icon: renderIcon(PersonOutline)
  },
  {
    label: 'Logout',
    key: 'logout',
    icon: renderIcon(LogOutOutline)
  }
])

const getUserData = async () => {
  const token = localStorage.getItem('access_token')
  const response = await useApi().get('/users', {
    headers: {
      Authorization: `Bearer ${token}`
    }

  })
  userData.value = response.data
}

const handleLogOut = async () => {
  try {
    const token = localStorage.getItem('access_token')
    await useApi().post(import.meta.env.VITE_API_URL + '/auth/logout', null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    // Clear access_token from localStorage
    localStorage.removeItem('access_token')
    // Redirect to login page
    notification.success({
      title: 'Success',
      content: 'Logout successful',
      duration: 2500
    })
    router.push('/login')
  } catch (error) {
    if (error.response?.status === 401) {
      await useApi().post('/auth/refresh', null)
      notification.success({
        title: 'Success',
        content: 'Logout successful',
        duration: 2500
      })
      router.push('/login')
    }
    console.error('Error:', error)
  }
}

const handleSelectProfile = (key) => {
  if (key === 'logout') {
    handleLogOut()
  } else if (key === 'profile') {
    router.push('/profile')
    globalStore.miniScreenCollapsed = false
  }
}

onMounted(async () => {
  // const token = await getAccessTokenSilently()
  // globalStore.fetchUserData(token)
  getUserData()
})
</script>

<template>

  <div class="header" ref="headerRef">
    <div class="logo">
      <template v-if="globalStore.theme === 'light'">
        <img
          v-show="globalStore.collapsed && !globalStore.miniScreenCollapsed"
          key="mini-logo"
          src="/src/assets/logo-ttg.svg"
          style="width: 2rem; height: auto; margin-left: 0.5rem; cursor: pointer"
          @click="router.push('/')"
        />
        <img
          v-show="!globalStore.collapsed || globalStore.miniScreenCollapsed"
          key="full-logo"
          src="/src/assets/logo-ttg.svg"
          style="width: 7.125rem; height: auto; margin-top: 0; cursor: pointer"
          @click="router.push('/')"
        />
      </template>
      <template v-else>
        <img
          v-show="globalStore.collapsed && !globalStore.miniScreenCollapsed"
          key="mini-logo"
          src="/src/assets/logo-ttg-white.svg"
          style="width: 2rem; height: auto; margin-left: 0.5rem; cursor: pointer"
          @click="router.push('/')"
        />
        <img
          v-show="!globalStore.collapsed || globalStore.miniScreenCollapsed"
          key="full-logo"
          src="/src/assets/logo-ttg-white.svg"
          style="width: 7.125rem; height: auto; margin-top: 0; cursor: pointer"
          @click="router.push('/')"
        />
      </template>
      <div @click="handleToggleCollapsed" class="collapse-logo">
        <n-icon
          :component="DehazeFilled"
          size="24"
          :color="globalStore.collapsed ? '#9E9E9E' : 'var(--color-default)'"
          :style="{
            transform: globalStore.collapsed ? 'rotate(0deg)' : 'rotate(90deg)',
            transition: 'transform 0.3s',
            cursor: 'pointer'
          }"
        />
      </div>
    </div>
    <div class="header-right">
      <!-- <div class="search-bar">
        <SearchBar :queryFn="fetchSearchCompany" :isNavigation="true" />
      </div> -->
    </div>
    <n-button secondary text class="search-popover" @click="globalStore.toggleDrawerSearch">
      <n-icon :component="IosSearch" size="24" color="#9E9E9E" />
    </n-button>
    <DrawerSearch v-model:show="globalStore.drawerSearchActive" />
    <div class="profile-content">
      <n-avatar
        :size="35"
        round
        src="/ava-ic.svg"
      />
      <div style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{userData?.username}}</div>
      <div class="profile-content-item" style="cursor: pointer !important">
        <n-popover
          trigger="click"
          :show-arrow="false"
          style="margin: 0 !important; padding: 0 !important; border-radius: 0 0px 15px 15px"
        >
          <template #trigger>
            <div style="display: flex; align-items: center; padding-top: 0.1rem">
              <n-icon :component="ChevronDown" size="14" color="#9E9E9E" />
            </div>
          </template>
          <a
            href="#"
            class="profile-content-item-popover"
            @click.prevent="handleSelectProfile('logout')"
          >
            <n-icon :component="LogOutOutline" size="20" color="#9E9E9E" />
            <div class="profile-content-item-popover-item paragraph-14-regular neutral-30">
              Logout
            </div>
          </a>
        </n-popover>
      </div>
    </div>
    <!-- layar kecil  -->
    <div
      class="header-right-item"
      style="cursor: pointer !important"
      @click="handleToggleMiniScreen"
    >
      <n-icon
        :component="DehazeFilled"
        size="24"
        :color="globalStore.miniScreenCollapsed ? 'var(--color-default)' : '#9E9E9E'"
      />
    </div>
    <!-- <div style="background-color:red;">SWITCH</div> -->
    <!-- <n-switch v-model:value="isDarkTheme"/> -->
    <n-drawer
      style="margin-top: 61px !important; box-shadow: none !important; height: 75%"
      class="mini-screen-drawer"
      v-model:show="globalStore.miniScreenCollapsed"
      width="100vw"
      placement="top"
      :show-mask="false"
      @update:show="handleToggleMiniScreen"
    >
      <n-drawer-content>
        <div class="mini-screen-content">
          <div class="content-item-profile">
            <a
              href="/profile"
              class="content-item-profile-left"
              style="cursor: pointer !important; text-decoration: none"
              @click.prevent="router.push('/profile') && (globalStore.miniScreenCollapsed = false)"
            >
              <n-avatar
                round
                :src="globalStore?.userData?.picture"
                style="width: 35px; height: 35px; flex-shrink: 0"
              />
              <div class="paragraph-14-semibold">
                {{ globalStore?.userData?.name?.substring(0, 2).toUpperCase() }}
              </div>
            </a>
            <div class="content-item-profile-right">
              <Tooltips
                placement="bottom"
                style="margin-top: 1rem"
                :icon="QuestionCircle20Regular"
                :icon-size="16"
              >
                <div class="paragraph-12-regular neutral-30">TES</div>
              </Tooltips>
              <n-progress
                type="line"
                indicator-placement="inside"
                color="#3FAA6A"
                :height="20"
                :percentage="globalStore.creditPercentage"
                class="progress-bar"
              >
                <div class="paragraph-12-semibold neutral-00">{{ globalStore.userCredits }}</div>
              </n-progress>
            </div>
          </div>
          <div class="mini-screen-menu">
            <a
              href="/"
              class="mini-screen-menu-item"
              :class="{ 'bg-primary-00 round': route.path === '/' }"
              @click.prevent="router.push('/') && (globalStore.miniScreenCollapsed = false)"
            >
              <n-icon
                :component="Grid28Filled"
                size="24"
                :color="route.path === '/' ? 'var(--color-default)' : '#9E9E9E'"
              />
              <div
                class="paragraph-14-semibold"
                :style="{ color: route.path === '/' ? 'var(--color-default)' : '#9E9E9E' }"
              >
                Dashboard
              </div>
            </a>
            <a
              href="/categories-management"
              class="mini-screen-menu-item"
              :class="{ 'bg-primary-00 round': route.path === '/categories-management' }"
              @click.prevent="
                router.push('/categories-management') && (globalStore.miniScreenCollapsed = false)
              "
            >
              <n-icon
                :component="Albums"
                size="24"
                :color="
                  route.path === '/categories-management' ? 'var(--color-default)' : '#9E9E9E'
                "
              />
              <div
                class="paragraph-14-semibold"
                :class="{
                  'text-primary': route.path === '/categories-management',
                  'text-grey': route.path !== '/categories-management'
                }"
              >
                Categories Management
              </div>
            </a>
            <a
              href="/expense-management"
              class="mini-screen-menu-item"
              :class="{ 'bg-primary-00 round': route.path === '/expense-management' }"
              @click.prevent="
                router.push('/expense-management') && (globalStore.miniScreenCollapsed = false)
              "
            >
              <n-icon
                :component="StatsChart"
                size="24"
                :color="route.path === '/expense-management' ? 'var(--color-default)' : '#9E9E9E'"
              />
              <div
                class="paragraph-14-semibold"
                :class="{
                  'text-primary': route.path === '/expense-management',
                  'text-grey': route.path !== '/expense-management'
                }"
              >
                Expense Management
              </div>
            </a>

            <n-divider />
            <div class="mini-screen-options">
              <a
                href="/logout"
                class="mini-screen-options-item"
                :class="{ 'bg-primary-00 round': route.path === '/logout' }"
                @click.prevent="handleLogOut() && (globalStore.miniScreenCollapsed = false)"
              >
                <n-icon
                  :component="LogOutOutline"
                  size="24"
                  :color="route.path === '/logout' ? 'var(--color-default)' : '#9E9E9E'"
                />
                <div class="paragraph-14-semibold neutral-30">Logout</div>
              </a>
            </div>
          </div>
        </div>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<style scoped>
.profile-content-item-popover {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.profile-content-item-popover:hover {
  cursor: pointer;
  background-color: #f5f5f5;
}

.profile-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.n-dropdown-menu {
  max-height: calc(100vh - 70px);
  overflow-y: auto;
}

.mini-screen-menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}
.mini-screen-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.mini-screen-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mini-screen-options-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
}

.content-item-profile-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.content-item-profile-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.content-item-profile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
}

.progress-bar {
  width: 6.875rem;
}

.mini-screen-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.header {
  display: flex;
  align-items: center;
  background-color: var(--background-color);
  gap: 1rem;
}
.header-right {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 0.5rem;
}

.header-left-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-right-item {
  display: flex;
  align-items: center;
  display: none;
}

.logo {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.custom-header {
  display: none;
}

@media (max-width: 1140px) {
  .credit {
    display: none;
  }
}

.search-popover {
  display: none;
}

@media (max-width: 768px) {
  .search-bar {
    display: none;
  }
  .search-popover {
    display: block;
  }
  .profile-content {
    display: none;
  }
  .header-left-item {
    display: none;
  }
  .header-right-item {
    display: flex;
  }
  .collapse-logo {
    display: none;
  }
}

@media (max-width: 325px) {
  .content-item-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    width: 100%;
  }

  .mini-screen-menu {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 1;
}

:deep(.n-avatar img) {
  object-fit: cover;
  object-position: top;
}
</style>
