<template>
  <n-drawer
    v-model:show="globalStore.drawerSearchActive"
    width="100vw"
    height="100vh"
    placement="bottom"
  >
    <n-drawer-content>
      <template #header>
        <div style="display: flex; align-items: center; gap: 1rem">
          <n-button secondary text @click="globalStore.toggleDrawerSearch">
            <n-icon :component="ArrowLeft12Regular" size="24" />
          </n-button>
          <n-input
            placeholder="Search Company"
            size="large"
            class="paragraph-16-regular"
            style="position: relative; z-index: 1; border-radius: 50px"
            v-model:value="searchQuery"
          >
            <template #prefix>
              <n-icon :component="IosSearch" size="22" />
            </template>
          </n-input>
        </div>
      </template>
      <div class="list-company-container">
        <n-infinite-scroll :distance="20" @load="handleLoad" style="height: 100%">
          <n-empty v-if="filteredData.length === 0" description="No results found"></n-empty>
          <div
            class="list-company-item"
            v-for="item in filteredData"
            :key="item._id"
            @click="handleNavigate(item._id)"
          >
            <div>
              <n-avatar
                v-if="item.logo_url"
                size="medium"
                :src="item.logo_url"
                @error="item.logo_url = null"
              />
              <template v-if="!item.logo_url">
                <n-icon size="20" :component="BuildingSkyscraper" />
              </template>
            </div>
            <div
              style="
                font-size: 14px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 200px;
              "
            >
              {{ item.name }}
            </div>
          </div>
        </n-infinite-scroll>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>
<script setup>
import { IosSearch, IosClose } from '@vicons/ionicons4'
import { ArrowLeft12Regular } from '@vicons/fluent'
import { BuildingSkyscraper } from '@vicons/tabler'
import { useGlobalStore } from '@/stores/global'
import { ref, computed, watch, onMounted } from 'vue'
import { debounce } from 'lodash'

const globalStore = useGlobalStore()
const searchQuery = ref('')
const router = useRouter()
const loading = ref(false)
const data = ref([])
const meta = ref({
  page: 1,
  pageSize: 10,
  totalPages: 0,
  totalResults: 0
})

const handleNavigate = (id) => {
  router.push(`/company/${id}`)
  globalStore.toggleDrawerSearch()
}

// const updateData = async (isLoadMore) => {
//   loading.value = true
//   try {
//     const token = await getAccessTokenSilently()
//     const page = isLoadMore ? meta.value.page : 1
//     const pageSize = isLoadMore ? 10 : meta.value.page * 10
//     const response = await useApi().get(
//       '/companies/search',
//       {
//         page,
//         limit: pageSize,
//         search: searchQuery.value
//       },
//       token
//     )

//     if (isLoadMore) {
//       data.value = [...data.value, ...response.data.results]
//     } else {
//       data.value = response.data.results
//     }
//     meta.value = {
//       page: response.data.page,
//       pageSize: response.data.limit,
//       totalPages: response.data.totalPages,
//       totalResults: response.data.totalResults
//     }
//   } catch (error) {
//   } finally {
//     loading.value = false
//   }
// }

// const handleLoad = async () => {
//   if (meta.value.page < meta.value.totalPages) {
//     meta.value.page += 1
//     await updateData(true)
//   }
// }

// const debouncedSearch = debounce(async (search) => {
//   searchQuery.value = search
//   await updateData(false)
// }, 300)

// watch(searchQuery, (val) => {
//   debouncedSearch(val)
// })

// onMounted(() => {
//   updateData()
// })

// const filteredData = computed(() => {
//   return data.value.filter((item) =>
//     item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
//   )
// })
</script>
<style scoped>
.list-company-item {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 10px;
}

.list-company-item:hover {
  background-color: #fafafa;
  cursor: pointer;
}

.list-company-container {
  padding: 10px;
}

.input-btn {
  width: 350px;
}

@media (max-width: 670px) {
  .input-btn {
    width: 300px;
  }
}

@media (max-width: 620px) {
  .input-btn {
    width: 100%;
  }
}

:deep(.n-drawer-body-content-wrapper) {
  padding: 0 !important;
}
</style>
