<template>
  <div>
    <n-data-table
      ref="dataTableInst"
      :columns="getColumns"
      :data="data"
      :loading="loading"
      :row-key="getRowKey"
      v-model:checked-row-keys="checkedRowKeys"
      size="large"
      :row-props="props.rowProps"
      ellipsis
      @update:sorter="handleSorterChange"
      @update:checked-row-keys="handleSelectRows"
      :max-height="'70vh'"
      :scrollbar-props="{
        trigger: 'none'
      }"
      :scroll-x="props.scrollX"
      class="paragraph-14-regular"
      default-sort-order="ascend"
    />
    <div
      v-if="!data.length"
      style="
        text-align: center;
        justify-content: center;
        display: flex;
        align-items: center;
        height: 50vh;
      "
    >
      <div class="paragraph-16-regular neutral-30" v-if="thisPath === '/'">
        No Value Triggers detected for your Followed Companies in the selected time frame
      </div>
      <div
        class="paragraph-16-regular neutral-30"
        v-else-if="thisPath === '/company' || thisPath === '/company/admin'"
        style="
          text-align: center;
          width: 40%;
          height: 50%;
          display: flex;
          align-items: end;
          justify-content: center;
        "
      >
        Looks like you need to add companies to follow <br />
        Use the Search bar to look up and start following companies
      </div>
      <div
        class="paragraph-16-regular neutral-30"
        v-else-if="thisPath === '/master-datasource'"
        style="
          text-align: center;
          width: 40%;
          height: 50%;
          display: flex;
          align-items: end;
          justify-content: center;
        "
      >
        Looks like you don't have a data source. Please wait for the background task to finish the
        data gathering process.
      </div>
      <div
        class="paragraph-16-regular neutral-30"
        v-else-if="thisPath === '/traceability'"
        style="
          text-align: center;
          width: 40%;
          height: 50%;
          display: flex;
          align-items: end;
          justify-content: center;
        "
      >
        No data available for Traceability Report.<br />
        Please click Process Button to search for other data.
      </div>
    </div>
    <div
      v-if="props.pagination && data.length > 0"
      style="
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-top: 1rem;
      "
    >
      <div>
        <div
          class="paragraph-14-regular neutral-30"
          v-if="meta.page * meta.pageSize > meta.totalResults"
        >
          {{ (meta.page - 1) * meta.pageSize + 1 }} - {{ meta.totalResults }} of
          {{ meta.totalResults }}
        </div>
        <div v-else class="paragraph-14-regular neutral-30">
          {{ (meta.page - 1) * meta.pageSize + 1 }} - {{ meta.page * meta.pageSize }} of
          {{ meta.totalResults }}
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 0.1rem">
        <!-- Page Size Selector -->
        <div style="display: flex; align-items: center; gap: 0.1rem">
          <div class="paragraph-14-regular neutral-30">Rows per page:</div>
          <n-popselect
            v-model:value="meta.pageSize"
            :options="availablePageSizes"
            size="small"
            @update:value="onPageSizeChange"
            trigger="click"
          >
            <n-button
              size="small"
              class="paragraph-14-regular neutral-30"
              text
              style="min-width: 50px"
            >
              {{ meta.pageSize }}
              <n-icon size="small" style="margin-left: 4px">
                <KeyboardArrowDownOutlined />
              </n-icon>
            </n-button>
          </n-popselect>
        </div>

        <!-- Previous Button -->
        <n-button
          quaternary
          :disabled="meta.page === 1 || loading"
          @click="onPageChange(meta.page - 1)"
        >
          <n-icon
            size="24"
            class="round"
            :component="KeyboardArrowLeftRound"
            :color="
              meta.page === 1 || loading ? 'rgba(167, 167, 173, 0.5)' : 'rgba(167, 167, 173, 1)'
            "
            style="outline: 1px solid rgba(70, 79, 96, 0.24); z-index: 10"
          />
        </n-button>

        <!-- Page Information -->
        <span class="paragraph-14-regular neutral-30">
          {{ meta.page }} of {{ meta.totalPages }}
        </span>

        <!-- Next Button -->
        <n-button
          quaternary
          :disabled="meta.page === meta.totalPages || loading"
          @click="onPageChange(meta.page + 1)"
        >
          <n-icon
            size="24"
            class="round"
            :component="KeyboardArrowRightRound"
            :color="
              meta.page === meta.totalPages || loading
                ? 'rgba(167, 167, 173, 0.5)'
                : 'rgba(167, 167, 173, 1)'
            "
            style="outline: 1px solid rgba(70, 79, 96, 0.24)"
          />
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  KeyboardArrowLeftRound,
  KeyboardArrowRightRound,
  KeyboardArrowDownOutlined
} from '@vicons/material'
import { NTooltip } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global'

const globalStore = useGlobalStore()
const router = useRouter()
const props = defineProps({
  columns: {
    type: Array,
    required: true
  },
  useCheckbox: {
    type: Boolean,
    default: false
  },
  rowKey: {
    type: String,
    default: () => 'id'
  },
  queryFn: {
    type: Function
  },
  pagination: {
    type: Boolean,
    default: true
  },
  rowProps: {
    type: Function,
    default: undefined
  },
  scrollX: {
    type: Number,
    default: 1400
  }
})

const goToCompanyProfile = (id, tab) => {
  globalStore.defaultTab = tab
  router.push(`/company/${id}`)
}

const emit = defineEmits(['update:page', 'update:selectedRows', 'update:data'])
const checkedRowKeys = ref([])
const thisPath = useRoute().path
const availablePageSizes = [
  {
    label: '5',
    key: 5,
    value: 5
  },
  {
    label: '10',
    key: 10,
    value: 10
  },
  {
    label: '20',
    key: 20,
    value: 20
  },
  {
    label: '50',
    key: 50,
    value: 50
  }
]

const handleSelectRows = (keys) => {
  emit('update:selectedRows', keys)
}

const onPageChange = (val) => {
  meta.value.page = val
  updateData()
}
const onPageSizeChange = (val) => {
  meta.value.pageSize = Number(val)
  meta.value.page = 1
  updateData()
}

onMounted(() => {
  updateData()
})

let data = ref([])
let meta = ref({
  page: 1,
  pageSize: 20,
  totalPages: 0,
  totalResults: 0,
  sortBy: '',
  sortOrder: '',
  period: null,
  filters: {}
})
let loading = ref(false)
const getColumns = computed(() => {
  const baseColumns = props.columns.map((column) => ({
    ...column,
    title:
      typeof column.title === 'string'
        ? () => h('div', { class: 'paragraph-14-semibold' }, column.title)
        : column.title,
    render:
      column.render ||
      ((row) => {
        const value = row[column.key]
        if (column.type === 'selection' || value == null) {
          return value
        } else if (column.type === 'link') {
          return h(
            NTooltip,
            {
              trigger: 'hover',
              placement: 'bottom',
              style: {
                backgroundColor: 'white',
                color: '#545457',
                maxWidth: '200px',
                maxHeight: '250px',
                cursor: 'pointer'
              },
              arrowStyle: {
                backgroundColor: 'white'
              }
            },
            {
              default: () => value,
              trigger: () =>
                h(
                  'a',
                  {
                    href: value,
                    target: '_blank',
                    style: {
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'block',
                      cursor: 'pointer',
                      color: '#1E1E1E'
                    }
                  },
                  value
                )
            }
          )
        }

        return h(
          NTooltip,
          {
            trigger: 'hover',
            placement: 'bottom',
            style: {
              backgroundColor: 'white',
              color: '#545457',
              maxWidth: '200px',
              maxHeight: '250px',
              cursor: 'pointer',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            },
            arrowStyle: {
              backgroundColor: 'white'
            }
          },
          {
            default: () => value,
            trigger: () =>
              h(
                'div',
                {
                  style: {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    cursor: 'default'
                  },
                  class: column.className
                },
                value
              )
          }
        )
      }),
    renderSorterIcon: ({ order }) => {
      const style = 'transform: translateY(-3px);'
      if (order === false)
        return h('div', [
          h('img', {
            src: '/switch-vertical2.svg',
            alt: 'Ascend',
            width: '16',
            height: '16',
            style: { marginTop: '10px' }
          })
        ])
      if (order === 'descend')
        return h('div', [
          h('img', {
            src: '/switch-vertical.svg',
            alt: 'Descend',
            width: '16',
            height: '16',
            style: { marginTop: '10px' }
          })
        ])
      if (order === 'ascend')
        return h('div', [
          h('img', {
            src: '/switch-vertical.svg',
            alt: 'Ascend',
            width: '16',
            height: '16',
            style: { transform: 'rotate(-180deg)', marginTop: '10px' }
          })
        ])
    }
  }))

  if (props.useCheckbox) {
    return [{ type: 'selection', className: 'selection-row' }, ...baseColumns]
  }
  return baseColumns
})

const getRowKey = (row) => {
  return row[props.rowKey]
}

const emitEvent = (key, val) => {
  emit(key, val)
}

const goToExternalLink = (url) => {
  window.open(url, '_blank')
}

const updateLoading = (val) => {
  loading.value = val
}

const updateData = async () => {
  if (props.queryFn) {
    const response = await props.queryFn(
      meta.value.page,
      meta.value.pageSize,
      updateLoading,
      {
        sortBy: meta.value.sortBy,
        sortOrder: meta.value.sortOrder
      },
      meta.value.period,
      meta.value.filters
    )
    data.value = response.data
    meta.value = {
      ...meta.value,
      totalPages: Math.ceil(response.meta.totalResults / meta.value.pageSize),
      totalResults: response.meta.totalResults
    }
  }
}

const handleSorterChange = (sorter) => {
  if (sorter.order === 'descend') {
    meta.value.sortBy = sorter.columnKey
    meta.value.sortOrder = 'asc'
  } else if (sorter.order === 'ascend') {
    meta.value.sortBy = sorter.columnKey
    meta.value.sortOrder = 'desc'
  } else {
    meta.value.sortBy = null
    meta.value.sortOrder = null
  }
  updateData()
}

const onFirstPage = () => {
  meta.value.page = 1
  updateData()
}

const onLastPage = () => {
  meta.value.page = meta.value.totalPages
  updateData()
}

const refresh = () => {
  meta.value.page = 1
  updateData()
}

defineExpose({
  refresh
})
</script>

<style scoped>
:deep(.n-input__border) {
  display: none;
}

:deep(.n-tag__content) {
  font-weight: 700;
}

:deep(.n-data-table .n-data-table-tr) {
  vertical-align: center;
}

:deep(.n-data-table .n-data-table-td) {
  font-size: 0.875rem !important;
}

:deep(.n-data-table .n-data-table-tr .selection-row) {
  vertical-align: middle !important;
}

:deep(.n-data-table.n-data-table--bordered.n-data-table--single-line) {
  border-radius: 15px 15px 0 0 !important;
}

:deep(.n-checkbox.n-checkbox--inside-table) {
  --n-border-radius: 5px !important;
}

:deep(.n-data-table.n-data-table--bordered .n-data-table-wrapper) {
  border-radius: 15px !important;
}

:deep(.n-data-table-sorter) {
  opacity: 0;
  transition: opacity 0.2s ease;
}

:deep(.n-data-table-th:hover .n-data-table-sorter) {
  opacity: 1;
}

:deep(.n-data-table-sorter.n-data-table-sorter--desc) {
  opacity: 1;
}
:deep(.n-data-table-sorter.n-data-table-sorter--asc) {
  opacity: 1;
}

:deep(.n-data-table-empty) {
  display: none;
}
:deep(.n-modal.n-data-table) {
  --n-merged-td-color-sorting: #1a9c4d !important;
}

:deep(.n-data-table-table) {
  --n-merged-td-color-sorting: none !important;
  --n-merged-th-color-sorting: none !important;
}

:deep(.n-data-table-th.n-data-table-th--fixed-left.n-data-table-th--sortable) {
  background-color: #fafafc;
}

:deep(.n-data-table-td.n-data-table-td--sorting.n-data-table-td--fixed-left) {
  background-color: white;
}
</style>
