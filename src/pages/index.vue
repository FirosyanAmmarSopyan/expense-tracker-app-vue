<template>
  <div class="container">
    <div class="top-container">
      <n-grid x-gap="20" y-gap="20" :cols="miniScreen ? 1 : 12" item-responsive>
        <n-gi class="left-section" span="8">
          <div style="display: flex; justify-content: space-between; align-items: center">
            <div class="header-semibold" style="color: var(--text-color)">Expense Management</div>
            <n-select
              v-model:value="selectedPeriod"
              :options="periodOptions"
              style="width: 150px"
            />
          </div>
          <div class="chart-scroll-container">
            <div class="chart-container">
              <canvas ref="chartRef"></canvas>
            </div>
          </div>
        </n-gi>
        <n-gi span="4" style="display: flex; flex-direction: column; gap: 1rem">
          <div class="right-top">
            <div style="display: flex; justify-content: space-between; height: 100%">
              <div
                style="
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  height: 100%;
                "
              >
                <div style="display: flex; flex-direction: column; gap: 0.5rem">
                  <div class="header-semibold-xl" style="color: var(--text-color)">
                    {{ formatCurrency(totalExpense, 'Rp', 0) }}
                  </div>
                  <div class="paragraph-14-semibold" style="color: var(--text-color)">
                    Total Expenses
                  </div>
                  <div class="paragraph-14-regular text-grey">This {{ selectedPeriod }}</div>
                </div>
                <div style="display: flex">
                  <div
                    class="paragraph-14-regular"
                    style="display: flex; align-items: center; gap: 0.5rem"
                  >
                    <n-icon :color="isIncreasing ? '#005F97' : '#FF0000'">
                      <ArrowUp v-if="isIncreasing" />
                      <ArrowDown v-else />
                    </n-icon>
                    {{ expenseTrendPercentage }}% more than last {{ selectedPeriod }}
                  </div>
                </div>
              </div>
              <div>
                <n-image src="/book-ic.svg" width="70" height="70" preview-disabled />
              </div>
            </div>
          </div>
          <div class="right-top">
            <div style="display: flex; justify-content: space-between; height: 100%">
              <div
                style="
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  height: 100%;
                "
              >
                <div style="display: flex; flex-direction: column; gap: 0.5rem">
                  <div class="header-semibold-xl" style="color: var(--text-color)">
                    +{{ expenseTrend.toFixed(2) }}%
                  </div>
                  <div class="paragraph-14-semibold" style="color: var(--text-color)">
                    Expense Trend
                  </div>
                  <div class="paragraph-14-regular text-grey">vs Last {{ selectedPeriod }}</div>
                </div>
                <div style="display: flex">
                  <div
                    class="paragraph-14-regular"
                    style="display: flex; align-items: center; gap: 0.5rem"
                  >
                    <n-icon :color="isIncreasing ? '#005F97' : '#FF0000'">
                      <ArrowUp v-if="isIncreasing" />
                      <ArrowDown v-else />
                    </n-icon>
                    {{ expenseTrendPercentage }}% more than last {{ selectedPeriod }}
                  </div>
                </div>
              </div>
              <div>
                <n-image src="/arrow-ic-ic.svg" width="60" height="60" preview-disabled />
              </div>
            </div>
          </div>
        </n-gi>
      </n-grid>
    </div>
    <div class="bottom-container">
      <n-grid x-gap="20" y-gap="20" cols="1" item-responsive>
        <n-gi class="left-section">
          <div class="header-semibold" style="color: var(--text-color); padding: 1rem 0">
            Recent Activity
          </div>
          <DataTable
            class="table"
            :queryFn="fetchRecentActivity"
            :columns="columns"
            :loading="loading"
            :pagination="false"
            ref="dataTableRef"
          />
        </n-gi>
      </n-grid>
    </div>
  </div>

  <ChangeModal
    :isVisible="showItemsModal"
    modalTitle="Items Detail"
    modalType="customize"
    :textOnly="false"
    :formInputs="[]"
    :style="{ width: windowWidth > 1420 ? '60vw' : '95vw' }"
    @update:isVisible="(val) => (val ? null : handleModalClose())"
  >
    <div style="width: 100%; padding-top: 1rem">
      <div style="display: flex; align-items: center; width: 100%;padding:1rem 0">
        <div class="paragraph-16-semibold">Detail Expense Management</div>
      </div>


      <div class="items-list-container">
        <div class="items-header">
          <div class="grid-item">Name</div>
          <div class="grid-item" style="padding-left: 1rem">Qty</div>
          <div class="grid-item">Price</div>
          <div class="grid-item">Subtotal</div>
        </div>

        <div v-for="(item, index) in selectedItems" :key="index" class="items-row">
          <div class="grid-item">
            <template v-if="item.isEditing">
              <n-input
                v-model:value="item.name"
                placeholder="Item Name"
                class="paragraph-14-regular input-info"
              />
            </template>
            <template v-else>
              <div class="item-with-status">
                {{ item.name || 'Unnamed Item' }}
                <n-badge v-if="item.isNew" dot type="success" />
                <n-badge v-else-if="item.isUpdated" dot type="info" />
              </div>
            </template>
          </div>
          <div class="grid-item" style="padding-left: 1rem">
            <template v-if="item.isEditing">
              <n-input
                v-model:value="item.quantity"
                placeholder="Quantity"
                @keydown="handleNumericInput"
                class="paragraph-14-regular input-info"
              />
            </template>
            <template v-else>
              {{ item.quantity || '0' }}
            </template>
          </div>
          <div class="grid-item">
            <template v-if="item.isEditing">
              <n-input
                v-model:value="item.price"
                placeholder="Price"
                @keydown="handleNumericInput"
                class="paragraph-14-regular input-info"
              >
                <template #prefix>Rp</template>
              </n-input>
            </template>
            <template v-else> {{ formatCurrency(Number(item.price || 0), 'Rp', 0) }} </template>
          </div>
          <div class="grid-item" style="font-weight: bold; color: #1890ff">
            <template v-if="item.isEditing">
              {{ formatCurrency(Number(item.quantity || 0) * Number(item.price || 0), 'Rp', 0) }}
            </template>
            <template v-else>
              {{ formatCurrency(Number(item.subtotal || 0), 'Rp', 0) }}
            </template>
          </div>
        </div>
      </div>
    </div>
  </ChangeModal>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, h, watch } from 'vue'
import { NTag, NIcon, NImage, NBadge, NButton } from 'naive-ui'
import { AlertCircle } from '@vicons/tabler'
import { ArrowUp, ArrowDown } from '@vicons/fa'
import Chart from 'chart.js/auto'
import { formatNumber, formatCurrency, formatNumberWithSuffix } from '@/utils/formatter'

const dataTableRef = ref(null)
const loading = ref(false)
const miniScreen = ref(false)
const totalExpense = ref(0)
const expenseTrend = ref(0)
const expenseTrendPercentage = ref(0)
const isIncreasing = ref(false)
const serverData = ref(null)
const chartRef = ref(null)
const showItemsModal = ref(false)
const selectedItems = ref([])
const currentExpenseId = ref(null)
const currentExpense = ref(null)
let myChart = null
const categoryMap = ref({})
const windowWidth = ref(window.innerWidth)

const checkScreenSize = () => {
  miniScreen.value = window.innerWidth < 1240
  if (myChart) {
    // Redraw chart when screen size changes to apply correct legend position
    initChart()
  }
}

const selectedPeriod = ref('week')
const periodOptions = [
  { label: 'Weekly', value: 'week' },
  { label: 'Monthly', value: 'month' },
  { label: 'Yearly', value: 'year' }
]

const fetchChartData = async () => {
  try {
    loading.value = true
    const response = await useApi().get(`/dashboard/expense-logs?period=${selectedPeriod.value}`)
    serverData.value = response.data

    // Create a mapping of category IDs to names
    if (response.data.categories && Array.isArray(response.data.categories)) {
      categoryMap.value = {}
      response.data.categories.forEach((category) => {
        categoryMap.value[category.id] = category.name
      })
    }

    initChart()
  } catch (error) {
    console.error('Error fetching chart data:', error)
  } finally {
    loading.value = false
  }
}

// Process server data for chart
const processChartData = () => {
  if (!serverData.value) return { labels: [], datasets: [] }

  const formatDate = (dateString) => {
    // Check if it's a yearly format (MM/YYYY)
    if (dateString.split('/').length === 2) {
      const [month, year] = dateString.split('/')
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
      return `${monthNames[parseInt(month) - 1]} ${year}`
    }
    // Regular format (DD/MM/YYYY)
    else {
      const [day, month, year] = dateString.split('/')
      const date = new Date(`${year}-${month}-${day}`)
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
      return `${day} ${monthNames[date.getMonth()]} ${year}`
    }
  }

  const labels = serverData.value.data.map((item) => formatDate(item.date))

  // Get all unique category IDs from the data
  const categoryIds = new Set()
  serverData.value.data.forEach((item) => {
    if (item.categories) {
      Object.keys(item.categories).forEach((categoryId) => {
        if (categoryId !== 'total') {
          categoryIds.add(categoryId)
        }
      })
    }
  })

  // Create datasets for each category
  const colors = [
    '#1a9c4d',
    '#1890ff',
    '#ff6b6b',
    '#ffc107',
    '#9c27b0',
    '#607d8b',
    '#795548',
    '#009688',
    '#673ab7',
    '#3f51b5',
    '#e91e63',
    '#f44336'
  ]

  const datasets = Array.from(categoryIds).map((categoryId, index) => {
    const colorIndex = index % colors.length

    // Extract data for this category
    const data = serverData.value.data.map((item) => {
      return item.categories && item.categories[categoryId] ? item.categories[categoryId] : 0
    })

    const categoryName =
      categoryMap.value[categoryId] || `Category ${categoryId.substring(categoryId.length - 5)}`

    return {
      label: categoryName,
      data: data,
      fill: false,
      borderColor: colors[colorIndex],
      tension: 0.1,
      pointBackgroundColor: colors[colorIndex],
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: colors[colorIndex],
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 2
    }
  })

  // Add total line
  if (datasets.length > 0) {
    datasets.push({
      label: 'Total',
      data: serverData.value.data.map((item) => item.total),
      fill: false,
      borderColor: '#000000',
      borderWidth: 2,
      tension: 0.1,
      pointBackgroundColor: '#000000',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: '#000000',
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 2
    })
  }

  return { labels, datasets }
}

const columns = computed(() => [
  {
    title: 'Date',
    key: 'date',
    width: '10%',
    render(row) {
      return row.date
    }
  },
  {
    title: 'Name',
    key: 'name',
    width: '20%'
  },
  {
    title: 'Category',
    key: 'category'
  },
  {
    title: 'Total Amount',
    key: 'totalAmount',
    render(row) {
      return formatCurrency(row.totalAmount, 'Rp', 0)
    }
  },
  {
    title: 'Items',
    key: 'items',
    render(row) {
      return h('div', [
        h(
          NButton,
          {
            class: 'paragraph-11-regular',
            style: {
              color: 'white',
              backgroundColor: 'var(--primary-20)',
              cursor: 'pointer'
            },
            size: 'small',
            round: true,

            onClick: () => handleShowItems(row.items, row.id)
          },
          'Detail'
        )
      ])
    },
    width: '7%'
  }
])

const formatDateToReadable = (dateString) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  const day = date.getDate()

  // Array of month names in lowercase
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const month = months[date.getMonth()]
  const year = date.getFullYear()

  return `${day} ${month} ${year}`
}

const fetchRecentActivity = async (page, pageSize, updateLoading) => {
  try {
    if (typeof updateLoading === 'function') {
      updateLoading(true)
    }
    const response = await useApi().get('/expenses/recent-activities')
    const data = response?.data?.data?.map((item) => ({
      date: formatDateToReadable(item.date),
      name: item.name,
      category: item.category?.name,
      totalAmount: item.totalAmount,
      items: item.items,
      id: item._id || item.id
    }))

    return {
      data: data,
      meta: {
        page: 1,
        pageSize: data.length,
        totalPages: 1,
        totalResults: data.length
      }
    }
  } catch (error) {
    if (typeof updateLoading === 'function') {
      updateLoading(false)
    }
    console.error('Error fetching companies:', error)
    return {
      data: [],
      meta: {
        page: 1,
        pageSize: 0,
        totalPages: 0,
        totalResults: 0
      }
    }
  } finally {
    if (typeof updateLoading === 'function') {
      updateLoading(false)
    }
  }
}

const handleShowItems = (items, expenseId) => {
  selectedItems.value = Array.isArray(items) ? items : [items]
  currentExpenseId.value = expenseId

  useApi()
    .get(`/expenses/${expenseId}`)
    .then((response) => {
      const expenseData = response.data
      // Format date to YYYY-MM-DD for input type="date"
      if (expenseData.date) {
        const date = new Date(expenseData.date)
        expenseData.date = date.toISOString().split('T')[0]
      }
      currentExpense.value = expenseData

      // Store the original data for the whole expense
      currentExpense.value.originalData = JSON.parse(JSON.stringify(currentExpense.value))
      
      showItemsModal.value = true
    })
    .catch((error) => {
      console.error('Error fetching expense details:', error)
    })
}

const handleModalClose = () => {
  showItemsModal.value = false
  selectedItems.value = []
  currentExpenseId.value = null
  currentExpense.value = null
}

const fetchExpenseSummary = async () => {
  try {
    const response = await useApi().get(`/dashboard/expense-data?period=${selectedPeriod.value}`)
    totalExpense.value = response.data.totalExpense
    expenseTrend.value = response.data.trend
    expenseTrendPercentage.value = response.data.percentageDifference
    isIncreasing.value = response.data.isIncrease
  } catch (error) {
    console.log(error)
  }
}

const initChart = () => {
  const ctx = chartRef.value.getContext('2d')

  if (myChart) {
    myChart.destroy()
  }

  let chartData = { labels: [], datasets: [] }

  if (serverData.value) {
    chartData = processChartData()
  } else {
    // Fallback data
    if (selectedPeriod.value === 'week') {
      chartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'No Data',
            data: [0, 0, 0, 0, 0, 0, 0],
            fill: false,
            borderColor: '#1a9c4d',
            tension: 0.1
          }
        ]
      }
    } else if (selectedPeriod.value === 'month') {
      chartData = {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ],
        datasets: [
          {
            label: 'No Data',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            fill: false,
            borderColor: '#1a9c4d',
            tension: 0.1
          }
        ]
      }
    } else {
      chartData = {
        labels: ['2019', '2020', '2021', '2022', '2023'],
        datasets: [
          {
            label: 'No Data',
            data: [0, 0, 0, 0, 0],
            fill: false,
            borderColor: '#1a9c4d',
            tension: 0.1
          }
        ]
      }
    }
  }

  const periodLabel =
    selectedPeriod.value === 'week'
      ? 'Weekly Expenses'
      : selectedPeriod.value === 'month'
        ? 'Monthly Expenses'
        : 'Yearly Expenses'

  // Force current miniScreen value to be used
  const currentMiniScreen = miniScreen.value

  myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.labels,
      datasets: chartData.datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          align: 'start',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: currentMiniScreen ? 10 : 15,
            boxWidth: currentMiniScreen ? 8 : 10,
            font: {
              size: currentMiniScreen ? 10 : 12
            }
          },
          maxWidth: currentMiniScreen ? 800 : 300,
          maxHeight: currentMiniScreen ? 400 : 200
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || ''
              if (label) {
                label += ': '
              }
              label += '$' + context.parsed.y.toFixed(2)
              return label
            }
          }
        }
      }
    }
  })
}

// Watch untuk perubahan periode
watch(selectedPeriod, () => {
  fetchChartData()
  fetchExpenseSummary()
})

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  fetchRecentActivity()
  fetchChartData()
  fetchExpenseSummary()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
  if (myChart) {
    myChart.destroy()
  }
})
</script>

<style scoped>
.grid-item {
  width: 10%;
  margin-bottom: 12px;
}

.selected-period {
  color: #1a9c4d;
}

.left-section {
  background-color: white;
  border-radius: 30px;
  padding-left: 1.4rem;
  padding-top: 1.5rem;
  padding-bottom: 1rem;
  padding-right: 1.4rem;
}
.right-top {
  background-color: white;
  border-radius: 30px;
  padding: 1.2rem;
  height: 100%;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.left-section-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: var(--background-color);
  border-radius: 10px;
  padding: 1rem;
  margin-top: 1rem;
  outline: 2px solid var(--background-color-sec);
}

:deep(.custom-hover:hover .paragraph-14-semibold) {
  /* color: #9e9e9e !important; */
  text-decoration: underline;
}

:deep(.clicked-tag:hover) {
  background-color: #1a9c4d !important;
  color: #e3faec !important;
}

@media (max-width: 768px) {
  .top-container {
    background-color: var(--background-color-sec);
  }
}

@media (max-width: 1400px) {
}

.selected-rows {
  margin: 1rem 0;
  padding: 1rem;
  background-color: var(--background-color-sec);
  border-radius: 8px;
}

.selected-row-item {
  margin: 0.5rem 0;
  padding: 0.5rem;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

:deep(.n-input.n-input--resizable.n-input--stateful) {
  border-radius: 30px !important;
}

:deep(.n-input.n-input--textarea.n-input--resizable.n-input--stateful) {
  border-radius: 15px !important;
}

.chart-scroll-container {
  width: 100%;
  overflow-x: auto;
  margin-top: 1rem;
  margin-bottom: 3rem;
}

.chart-container {
  background-color: var(--background-color);
  border-radius: 10px;
  padding: 1rem;
  outline: 2px solid var(--background-color-sec);
  height: 400px;
  position: relative;
  min-width: 500px; /* Minimum width to ensure visibility of chart with legend */
}


.expense-info {
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 8px;
}

.expense-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 1rem;
}

.input-info {
  background-color: var(--background-color-sec);
}

.items-list-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.items-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 8px;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-weight: bold;
  min-width: 600px;
}

.grid-item {
  display: flex;
  align-items: center;
  width: 100% !important;
  margin-bottom: 12px;
  gap: 1rem;
}

.items-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid #eee;
  align-items: center;
  min-width: 600px;
}

.item-with-status {
  display: flex;
  align-items: center;
  gap: 8px;
}


/* Mobile responsiveness */
@media (max-width: 768px) {
  .chart-container {
    width: 800px; /* Increased width for mobile to accommodate legend */
    padding-right: 50px; /* Add extra padding for the legend */
  }

  .chart-scroll-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch; /* For smooth scrolling on iOS */
  }
  .expense-info-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}

:deep(.n-base-selection.n-base-selection--selected) {
  --n-border-radius: 30px !important;
}
</style>
