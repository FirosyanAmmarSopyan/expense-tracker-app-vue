<template>
  <div class="feed-container">
    <div class="header-semibold title-feed">Feed</div>
    <n-divider style="margin-top: 1rem" />
    <n-infinite-scroll
      style="height: 100%; max-height: 78vh"
      :distance="15"
      @load="handleLoad"
      trigger="none"
    >
      <n-scrollbar ref="scrollbarRef">
        <div
          v-if="data.length === 0"
          style="height: 70vh; display: flex; align-items: center; justify-content: center"
        >
          <div class="paragraph-16-regular neutral-30" style="text-align: center">
            No recent Value Triggers detected for your Followed Companies
          </div>
        </div>
        <div
          v-else
          v-for="item in groupedData"
          :key="item._id"
          class="feed-item"
          style="display: flex; align-items: center; margin-bottom: 1rem; gap: 2rem"
        >
          <a
            :href="`/company/${item._id}`"
            style="display: flex; align-items: center; padding: 0 0.5rem 0.5rem 0; cursor: pointer"
          >
            <n-image
              preview-disabled
              style="object-fit: contain; object-position: center; width: 40px; height: 40px"
              :src="item.logo_url"
              fallback-src="/ic-building.png"
            />
          </a>
          <div class="container-value-trigger">
            <div
              class="container-value-trigger-inner"
              style="
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 0.7rem;
                padding-right: 2rem;
              "
            >
              <a
                :href="`/company/${item._id}#value-triggers-30-${encodeURIComponent(item.value_name)}`"
                style="text-decoration: none"
                @click="
                  (e) => {
                    // Only prevent default and use router for left clicks
                    if (!e.ctrlKey && !e.shiftKey && e.button !== 1) {
                      e.preventDefault()
                      goToCollapseValueTrigger(item._id, item.value_name, 'Value Triggers')
                    }
                  }
                "
              >
                <n-tag
                  style="cursor: pointer"
                  round
                  strong
                  class="primary-20 paragraph-11-semibold clicked-tag"
                  :color="{ borderColor: '#1a9c4d', color: '#E3FAEC' }"
                >
                  <div class="paragraph-11-semibold">{{ item.value_name }}</div>
                </n-tag>
              </a>
            </div>
            <div
              class="container-value-trigger-item"
              style="display: flex; align-items: center; gap: 0.5rem"
            >
              <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 0.2rem">
                <div class="paragraph-9-bold neutral-30">
                  {{ formatDataSourceType(item.source_types[0]) }}
                </div>
                <div class="paragraph-9-semibold neutral-30">|</div>
                <div class="paragraph-9-regular neutral-30">{{ formatTimeAgo(item.date) }}</div>
              </div>
            </div>
          </div>
        </div>
      </n-scrollbar>
    </n-infinite-scroll>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global'

const globalStore = useGlobalStore()
const router = useRouter()
const props = defineProps({
  queryFn: {
    type: Function
  }
})

const loading = ref(false)
const meta = reactive({
  page: 1,
  pageSize: 15,
  totalPages: 0,
  totalResults: 0
})
const data = ref([])
const scrollbarRef = ref(null)

const innerWidth = ref(window.innerWidth)

const groupedData = computed(() => {
  if (innerWidth.value > 450) {
    return data.value
  }

  // Group items by company ID
  const grouped = data.value.reduce((acc, item) => {
    if (!acc[item._id]) {
      acc[item._id] = {
        ...item,
        value_names: [item.value_name]
      }
    } else {
      if (acc[item._id].value_names.length < 4) {
        acc[item._id].value_names.push(item.value_name)
      }
    }
    return acc
  }, {})

  return Object.values(grouped)
})

const formatDataSourceType = (type) => {
  if (type === 'jobsearch') {
    return 'Job Posting'
  } else if (type === 'scrapper') {
    return 'Web Article'
  } else if (type === 'edgar') {
    return 'Company Filing'
  } else if (type === 'transcript') {
    return 'Transcript'
  }
}
const goToCollapseValueTrigger = (id, valueName, tab) => {
  globalStore.collapseValueTrigger = valueName
  globalStore.defaultTab = tab
  router.push(`/company/${id}`)
}

const updateInnerWidth = () => {
  innerWidth.value = window.innerWidth
}

const handleFeedItemClick = (id) => {
  router.push(`/company/${id}`)
  globalStore.defaultTab = 'Business Overview'
  globalStore.collapseValueTrigger = null
}

const updateLoading = (val) => {
  loading.value = val
}

const updateData = async () => {
  if (props.queryFn) {
    const response = await props.queryFn(meta.page, meta.pageSize, updateLoading)
    data.value.push(...response.data)
    meta.totalPages = response.meta.totalPages
    meta.totalResults = response.meta.totalResults
  }
}

const handleLoad = async () => {
  if (meta.page < meta.totalPages) {
    meta.page += 1
    await updateData()
  }
}

function formatTimeAgo(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return 'Today'
  } else if (diffDays === 1) {
    return '1d ago'
  } else if (diffDays < 7) {
    return `${diffDays}d ago`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks}w ago`
  } else {
    const months = Math.floor(diffDays / 30)
    return `${months}mo ago`
  }
}

onMounted(() => {
  window.addEventListener('resize', updateInnerWidth)
  updateData()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateInnerWidth)
})
</script>

<style scoped>
.title-feed {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 0.3rem;
  padding-left: 0.2rem;
}

img {
  width: 60px;
  height: 60px;
  object-fit: cover;
}

.feed-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.feed-item {
  border-radius: 15px;
  padding: 0.5rem;
  margin-bottom: 1rem;
}

.feed-item:hover {
  background-color: #f5f5f5;
}

.container-value-trigger {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.413rem;
}

:deep(.n-tag.n-tag--strong.n-tag--round.mini-tag) {
  --n-height: 23px !important;
}

@media (max-width: 1400px) {
  .container-value-trigger {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .container-value-trigger-inner {
    flex-direction: column;
    align-items: center;
  }

  .container-value-trigger-item {
    margin-left: -2rem !important;
  }
}

@media (max-width: 450px) {
  .title-feed {
    justify-content: flex-start;
  }
  .container-value-trigger {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: start;
    align-items: flex-start;
    width: 80% !important;
  }

  .feed-item {
    display: flex;
    flex-direction: row;
    justify-content: flex-start !important;
    gap: 0.5rem;
    align-items: flex-start;
    width: 100%;
  }
}

:deep(.clicked-tag:hover) {
  background-color: #1a9c4d !important;
  color: #e3faec !important;
}
</style>
