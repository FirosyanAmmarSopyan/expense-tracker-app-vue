<template>
  <n-popover
    :show="showPopover"
    :show-arrow="false"
    ref="popover"
    style="
      height: 100%;
      margin-top: -0.5px;
      border-radius: 0 0 10px 10px;
      padding: 0px 0;
      box-shadow:0 3px 6px -4px rgba(0, 0, 0, .12), 0 6px 16px 0 rgba(0, 0, 0, .08), 0 9px 28px 8px rgba(0, 0, 0, .05) !important;
      overflow: hidden;
      width: 100%;
    "
    placement="bottom"
    @mouseenter="handlePopoverEnter"
    @mouseleave="handlePopoverLeave"
  >
    <n-infinite-scroll style="max-height: 380px; width: 100%" :distance="10" @load="handleLoad">
      <div style="width: 100%">
        <n-spin
          v-if="isSearching"
          size="small"
          style="display: flex; justify-content: center; padding-left: 1rem"
        />
        <n-empty
          v-else-if="filteredData.length === 0"
          description="You can't find anything"
          style="padding: 2rem 3rem; width: 100%"
        ></n-empty>
        <div v-for="item in filteredData" :key="item._id" class="item-container">
          <div
            style="display: flex; gap: 10px; align-items: center; padding: 0 1rem"
            @click="
              !isNavigation
                ? handleFollow(item, 'Business Overview')
                : handleNavigate(item, 'Business Overview')
            "
          >
            <div>
              <n-avatar
                v-if="item.logo_url"
                round
                size="small"
                :src="item.logo_url"
                @error="item.logo_url = null"
              />
              <template v-if="!item.logo_url">
                <n-icon size="20" :component="BuildingSkyscraper" />
              </template>
            </div>
            <div
              style="
                display: flex;
                gap: 0.5rem;
                align-items: center;
                justify-content: space-between;
              "
            >
              <span
                style="
                  font-size: 14px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
                :style="{
                  width: isNavigation ? '300px' : item.isFollowed ? '270px' : '270px'
                }"
              >
                {{ item.name }}
              </span>
              <div
                v-if="isNavigation"
                class="paragraph-11-regular"
                style="white-space: nowrap; color: #a7a7ad"
              >
                {{ formatCurrency(item.annual_revenue) }}
              </div>
            </div>
          </div>
          <div
            v-if="!isNavigation"
            style="display: flex; align-items: center; gap: 0.5rem; padding-right: 1rem"
          >
            <n-spin size="10" v-if="item.isLoading" />
            <div class="paragraph-11-regular" style="white-space: nowrap; color: #a7a7ad">
              {{ formatCurrency(item.annual_revenue) }}
            </div>
            <n-button
              secondary
              size="small"
              text
              rounded
              color="#1A9C4D"
              v-if="!item.isFollowed && !item.isLoading"
              @click="handleFollow(item, 'business overview')"
            >
              <n-icon size="18" :component="CirclePlus" />
            </n-button>
            <div
              v-else-if="!item.isLoading"
              style="color: #a7a7ad; font-size: 0.55rem; white-space: nowrap"
            >
              Followed
            </div>
          </div>
        </div>
      </div>
    </n-infinite-scroll>
    <template #trigger>
      <n-input
        ref="inputRef"
        :placeholder="title"
        size="large"
        class="paragraph-16-regular"
        style="position: relative; z-index: 1; border-radius: 50px"
        v-model:value="searchQuery"
        @focus="handleInputFocus"
        @blur="handleInputBlur"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <template #prefix>
          <n-icon :component="IosSearch" size="22" />
        </template>
      </n-input>
    </template>
  </n-popover>

  <ChangeModal
    :isVisible="showSearchModal"
    modalTitle=""
    modalType="customize"
    :formInputs="[]"
    @update:isVisible="showSearchModal = $event"
  >
    <div
      style="
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
        justify-content: center;
      "
    >
      <div
        v-if="errorMessage"
        v-html="errorMessage"
        style="text-align: center; width: 85%; font-size: 1rem"
      ></div>
      <div v-else style="text-align: center; width: 70%; font-size: 1rem">
        Would you like to activate a Research Agent for this company?
      </div>
      <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1rem">
        <n-button
          secondary
          @click="showSearchModal = false"
          style="width: 100%; background-color: #9e9e9e; color: #fff"
          round
          class="paragraph-16-regular"
        >
          Cancel
        </n-button>
        <n-button
          secondary
          v-if="!errorMessage"
          @click="handleFollow(selectedCompany, 'business overview')"
          style="width: 100%; background-color: #1a9c4d; color: #fff"
          round
          color="#1A9C4D"
          class="paragraph-16-regular"
        >
          Activate
        </n-button>
        <n-button
          secondary
          v-else
          @click="handleUpgradePlan()"
          size="medium"
          style="width: 100%"
          round
          color="#1A9C4D"
          class="paragraph-16-regular"
        >
          Upgrade Plan
        </n-button>
      </div>
    </div>
  </ChangeModal>

  <ChangeModal
    :isVisible="showUpgradeModal"
    modalTitle=""
    modalType="customize"
    :formInputs="[]"
    @update:isVisible="showUpgradeModal = $event"
  >
    <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem">
      <n-icon :component="CheckCircleOutlineRound" size="150" color="#1A9C4D" />
      <div style="text-align: center; font-size: 1.2rem">
        <p>We've received your request! We will be in touch within 24 hours. Thank you!</p>
      </div>
    </div>
  </ChangeModal>
</template>

<script setup>
import { ref, computed, defineProps, watch } from 'vue'
import { NIcon } from 'naive-ui'
import { IosSearch } from '@vicons/ionicons4'
import { PlusRound, CheckCircleOutlineRound } from '@vicons/material'
import { BuildingSkyscraper, CirclePlus } from '@vicons/tabler'
import { debounce } from 'lodash'
import { useNotification } from 'naive-ui'
import NumberSuffix from 'number-suffix'
const notification = useNotification()
const globalStore = useGlobalStore()
const showSearchModal = ref(false)
const showUpgradeModal = ref(false)
const router = useRouter()
const props = defineProps({
  queryFn: {
    type: Function
  },
  isNavigation: {
    type: Boolean,
    default: false
  },
  dataTableRef: {
    type: Object,
    required: true
  },
  customStyle: {
    type: Boolean,
    default: false
  },
  isRefreshData: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Search'
  }
})

const emit = defineEmits(['refresh', 'followed'])
const popoverRef = ref(null)
const loading = ref(false)
const selectedCompany = ref(null)
const data = ref([])
const meta = ref({
  page: 1,
  pageSize: 10,
  totalPages: 0,
  totalResults: 0
})

const formatCurrency = (value) => {
  if (!value) return ''
  const numberSuffix = new NumberSuffix()
  numberSuffix.addStyle('currency', [' Th', ' M', ' B', ' T'])
  return `$ ${numberSuffix.format(value, { style: 'currency', precision: 1 })}`
}

const getData = computed(() => data.value)

const searchQuery = ref('')
const errorMessage = ref('')
const isSearching = ref(false)

const currentRequest = ref(null)

const updateLoading = (val) => {
  loading.value = val
}

const refreshData = () => {
  updateData()
}

const updateSelectedCompany = (company) => {
  selectedCompany.value = company
}

const debouncedSearch = debounce(async (search) => {
  isSearching.value = true
  searchQuery.value = search

  if (currentRequest.value) {
    currentRequest.value.abort()
  }

  currentRequest.value = new AbortController()

  try {
    await updateData(false, currentRequest.value.signal)
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request was aborted')
    } else {
      console.error('Search error:', error)
    }
  } finally {
    isSearching.value = false
  }
}, 300)

const handleUpgradePlan = () => {
  showUpgradeModal.value = true
  showSearchModal.value = false
  setTimeout(() => {
    showUpgradeModal.value = false
  }, 2000)
}

const updateData = async (isLoadMore, signal) => {
  isSearching.value = true
  if (props.queryFn) {
    const page = isLoadMore ? meta.value.page : 1
    const pageSize = isLoadMore ? 10 : meta.value.page * 10
    const response = await props.queryFn(page, pageSize, updateLoading, searchQuery.value, signal)

    if (isLoadMore) {
      data.value = [...data.value, ...response.data]
    } else {
      data.value = response.data
    }
    meta.value = response.meta
  }
  isSearching.value = false
}
const handleLoad = async () => {
  loading.value = true
  if (meta.value.page < meta.value.totalPages) {
    meta.value.page += 1
    await updateData(true)
  }
  loading.value = false
}
onMounted(() => {
  updateData()
})

const getDataTableRef = computed(() => props.dataTableRef)

const handleNavigate = (company, tab) => {
  if (props.isNavigation && company.isFollowed) {
    globalStore.defaultTab = tab
    router.push(`/company/${company._id}`)
  } else if (props.isNavigation && !company.isFollowed) {
    showSearchModal.value = true
    updateSelectedCompany(company)
  }
}

const handleFollow = async (company, tab) => {
  try {
    loading.value = true
    company.isLoading = true

    if (company.isFollowed) {
      globalStore.defaultTab = tab
      router.push(`/company/${company._id}`)
      showSearchModal.value = false
      return
    }
    notification.info({
      title: 'Info',
      content: 'Following company...',
      duration: 2500
    })
    // const token = await getAccessTokenSilently()
    // await useApi().post(`/users/follow-company/${company._id}`, {}, token)

    // Refresh user data immediately after following company
    // await globalStore.fetchUserData(token)

    // Continue with other updates
    company.isLoading = false
    updateFollowedCompany(company._id)
    showSearchModal.value = false
    emit('followed')
    loading.value = false
    notification.success({
      title: 'Success',
      content: 'Company followed',
      duration: 2500
    })
    getDataTableRef.value.refresh()
    refreshData()
  } catch (error) {
    company.isLoading = false
    if (error.response?.data.message === 'Token Error') {
      errorMessage.value = `You do not have enough credits to follow this company. <br/> <br/> Either adjust your followed companies or Value Triggers, or upgrade your plan for more credits.`
      showSearchModal.value = true
    } else if (error.response?.data.message === 'User already follows this company') {
      router.push(`/company/${company._id}`)
    } else if (error) {
      showSearchModal.value = false
      router.push(`/company/${company._id}`)
    }
  }
}

const updateFollowedCompany = (companyId) => {
  data.value = data.value.map((item) =>
    item._id === companyId ? { ...item, isFollowed: true } : item
  )
}

const filteredData = computed(() => {
  return getData.value
})

const getIsRefreshData = computed(() => props.isRefreshData)

watch(getIsRefreshData, (val) => {
  if (val) {
    meta.value.pageSize = meta.value.page * meta.value.pageSize
    meta.value.page = 1
    refreshData()
  }
})

watch(searchQuery, (val) => {
  debouncedSearch(val)
})

defineExpose({
  refresh: refreshData
})

const showPopover = ref(false)
const isInputFocused = ref(false)
const isHovered = ref(false)
const closeTimeout = ref(null)

const handleInputFocus = () => {
  isInputFocused.value = true
  showPopover.value = true
}

const handleInputBlur = () => {
  isInputFocused.value = false
  if (!isHovered.value) {
    closePopoverWithDelay()
  }
}

const handleMouseEnter = () => {
  if (closeTimeout.value) {
    clearTimeout(closeTimeout.value)
  }
  isHovered.value = true
  if (!showPopover.value) {
    showPopover.value = true
    inputRef.value?.inputEl?.focus()
  }
}

const handleMouseLeave = () => {
  isHovered.value = false
  closePopoverWithDelay()
}

const handlePopoverEnter = () => {
  if (closeTimeout.value) {
    clearTimeout(closeTimeout.value)
  }
  isHovered.value = true
}

const handlePopoverLeave = () => {
  isHovered.value = false
  closePopoverWithDelay()
}

const closePopoverWithDelay = () => {
  if (closeTimeout.value) {
    clearTimeout(closeTimeout.value)
  }
  closeTimeout.value = setTimeout(() => {
    if (!isInputFocused.value && !isHovered.value) {
      showPopover.value = false
    }
  }, 150)
}

const inputRef = ref(null)

watch(
  () => globalStore.refreshSearchData,
  async (newVal) => {
    if (newVal) {
      // Reset page dan refresh data
      meta.value.page = 1
      await updateData(false)
      // Reset flag setelah refresh
      globalStore.setRefreshSearchData(false)
    }
  }
)
</script>

<style scoped>
:deep(.n-base-selection__border) {
  border: 1px solid #e2e4e7;
  border-radius: 20px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.05);
}
:deep(.n-base-selection__state-border) {
  border: 1px solid #1163df;
  border-radius: 20px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 1);
}

.item-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 8px;
  transition: background-color 0.3s ease;
}
.item-container:hover {
  background-color: #f5f5f5;
  cursor: pointer;
}
</style>
