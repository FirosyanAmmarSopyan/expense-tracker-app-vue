<template>
  <div class="container">
    <n-spin v-if="isLoading" class="loading-overlay">
      <template #description>
        <div class="loading-text">Processing your receipt...</div>
      </template>
    </n-spin>
    <n-grid x-gap="20" y-gap="20" cols="1" item-responsive>
      <n-gi class="left-section">
          <div
            style="
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              gap: 1rem;
            "
          >
          <div class="header-semibold" style="width: 100%;">
            Expense Managements
          </div>
          <div style="display: flex; gap: 1rem; align-items: center;justify-content: flex-end;width: 100%">
            <div class="search-bar">
              <SearchBar
                :queryFn="fetchSearchCompany"
                :isNavigation="false"
                title="Search Expenses"
              />
            </div>
            <n-button
              round
              style="background-color: var(--primary-20); color: white"
              size="medium"
              @click="handleAdd"
              class="paragraph-14-semibold"
            >
              <n-icon size="20" style="margin-right: 0.2rem">
                <CirclePlus />
              </n-icon>
              Add
            </n-button>
            <n-button
              round
              style="background-color: var(--primary-20); color: white"
              size="medium"
              @click="handleAdd"
              class="paragraph-14-semibold"
            >
              <n-image src="/export-ic.svg" width="14" height="14" preview-disabled style="margin-right: 0.2rem" />
              Export
            </n-button>
          </div>
        </div>
        <div class="file-upload-section" @click="triggerFileInput">
          <div style="margin-bottom: 12px">
            <n-image src="/picture-ic.svg" width="48" height="48" preview-disabled />
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem">
            <n-text class="paragraph-16-semibold"> Choose image into here </n-text>
            <input
              type="file"
              ref="fileInput"
              style="display: none"
              accept=".jpg,.jpeg,.png"
              @change="handleFileInputChange"
            />
            <n-button
              class="paragraph-14-semibold"
              size="small"
              round
              style="background-color: var(--primary-20); color: white"
              @click.stop="triggerFileInput"
            >
              Choose File
            </n-button>
          </div>
        </div>
        <div class="left-section-content">
          <DataTable
            class="table"
            :queryFn="fetchExpenses"
            :columns="columns"
            :loading="loading"
            :useCheckbox="false"
            @update:selectedRows="handleCheck"
            ref="dataTableRef"
            :row-class-name="rowClassName"
          />
        </div>
      </n-gi>
    </n-grid>
  </div>
  <ChangeModal
    :isVisible="showAddModal"
    modalTitle=""
    modalType="customize"
    :textOnly="false"
    :formInputs="[]"
    @update:isVisible="showAddModal = $event"
  >
    <div
      style="
        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
        align-items: center;
      "
    >
      <div style="width: 100%">
        <div style="padding-bottom: 2rem" class="paragraph-16-semibold">Add Expense</div>
        <n-form ref="formRef" :model="formValue" :rules="rules" :size="size">
          <n-form-item label="Category" path="category">
            <n-select
              v-model:value="formValue.category"
              :options="categories"
              filterable
              placeholder="Select Category"
              clearable
              @search="handleSearch"
            />
          </n-form-item>
          <n-form-item label="Date" path="date">
            <n-input type="date" v-model:value="formValue.date" placeholder="" class="paragraph-14-regular input-info" />
          </n-form-item>
          <n-form-item label="Name" path="name">
            <n-input v-model:value="formValue.name" placeholder="Input Name" class="paragraph-14-regular input-info" />
          </n-form-item>
          <n-form-item label="Vendor Name" path="vendorName">
            <n-input v-model:value="formValue.vendorName" placeholder="Input Vendor Name" class="paragraph-14-regular input-info" />
          </n-form-item>
          <n-form-item>
            <div
              style="
                width: 100%;
                display: flex;
                gap: 1rem;
                justify-content: center;
                align-items: center;
              "
            >
              <n-button
                style="padding: 0.5rem 3rem; background-color: var(--neutral-30); color: white"
                size="large"
                round
                @click="showAddModal = false"
              >
                Cancel
              </n-button>
              <n-button
                size="large"
                round
                style="background-color: var(--primary-20); color: white; padding: 0.5rem 3rem"
                @click="handleSubmit"
              >
                Add
              </n-button>
            </div>
          </n-form-item>
        </n-form>
      </div>
    </div>
  </ChangeModal>

  <ChangeModal
    :isVisible="showEditModal"
    modalTitle=""
    modalType="customize"
    :textOnly="false"
    :formInputs="[]"
    @update:isVisible="showEditModal = $event"
  >
    <div
      style="
        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
        align-items: center;
      "
    >
      <div style="width: 100%">
        <n-form ref="editFormRef" :model="editFormValue" :rules="rules" :size="size">
          <div style="padding-bottom: 2rem" class="paragraph-16-semibold">Edit Expense</div>
          <n-form-item label="Category" path="category">
            <n-select
              v-model:value="editFormValue.category"
              :options="categories"
              filterable
              placeholder="Select Category"
              clearable
            />
          </n-form-item>
          <n-form-item label="Date" path="date">
            <n-input type="date" v-model:value="editFormValue.date" placeholder="" />
          </n-form-item>
          <n-form-item label="Name" path="name">
            <n-input v-model:value="editFormValue.name" placeholder="Input Name" />
          </n-form-item>
          <n-form-item label="Vendor Name" path="vendorName">
            <n-input v-model:value="editFormValue.vendorName" placeholder="Input Vendor Name" />
          </n-form-item>
          <n-form-item>
            <div
              style="
                width: 100%;
                display: flex;
                gap: 1rem;
                justify-content: center;
                align-items: center;
              "
            >
              <n-button
                style="padding: 0.5rem 3rem; background-color: var(--neutral-30); color: white"
                size="large"
                round
                @click="showEditModal = false"
              >
                Cancel
              </n-button>
              <n-button
                size="large"
                round
                style="background-color: var(--primary-20); color: white; padding: 0.5rem 3rem"
                @click="handleEditSubmit"
              >
                Update
              </n-button>
            </div>
          </n-form-item>
        </n-form>
      </div>
    </div>
  </ChangeModal>

  <ChangeModal
    :isVisible="showItemsModal"
    modalTitle="Items Detail"
    modalType="customize"
    :textOnly="false"
    :formInputs="[]"
    @update:isVisible="(val) => val ? (showItemsModal = true) : handleModalClose()"
    :style="{ width: windowWidth > 1420 ? '60vw' : '95vw' }"
  >
    <div style="width: 100%; padding-top: 1rem">
      <div style="display: flex; align-items: center; width: 100%">
        <div class="paragraph-16-semibold">Detail Expense Management</div>
      </div>

      <!-- Expense Information -->
      <div class="expense-info">
        <div class="expense-info-grid">
          <div>
            <div class="paragraph-14-semibold" style="padding-bottom: 0.5rem">Name</div>
            <n-input
              v-model:value="currentExpense.name"
              placeholder="Input Name"
              class="paragraph-14-regular input-info"
            />
          </div>
          <div>
            <div class="paragraph-14-semibold" style="padding-bottom: 0.5rem">Vendor Name</div>
            <n-input
              v-model:value="currentExpense.vendorName"
              placeholder="Input Vendor Name"
              class="paragraph-14-regular input-info"
            />
          </div>
          <div>
            <div class="paragraph-14-semibold" style="padding-bottom: 0.5rem">Date</div>
            <n-input
              type="date"
              v-model:value="currentExpense.date"
              placeholder=""
              class="paragraph-14-regular input-info"
            />
          </div>
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; padding-bottom: 1rem; gap: 1rem">
        <n-button round size="small" style="background-color: var(--primary-20); color: white" @click="handleAddNewItemRow">
          <n-icon>
            <CirclePlus />
          </n-icon>
          Add Item
        </n-button>
      </div>

      <div class="items-list-container">
        <div class="items-header">
          <div class="grid-item">Name</div>
          <div class="grid-item" style="padding-left: 1rem">Qty</div>
          <div class="grid-item">Price</div>
          <div class="grid-item">Subtotal</div>
          <div class="grid-item">Action</div>
        </div>

        <div v-for="(item, index) in selectedItems" :key="index" class="items-row">
          <div class="grid-item">
            <template v-if="item.isEditing">
              <n-input v-model:value="item.name" placeholder="Item Name" class="paragraph-14-regular input-info" />
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
              <n-input v-model:value="item.price" placeholder="Price" @keydown="handleNumericInput" class="paragraph-14-regular input-info">
                <template #prefix>Rp</template>
              </n-input>
            </template>
            <template v-else> {{ formatCurrency(Number(item.price || 0), 'Rp', 0) }} </template>
          </div>
          <div class="grid-item" style="font-weight: bold; color: #1890ff">
            <template v-if="item.isEditing">
              {{ formatCurrency((Number(item.quantity || 0) * Number(item.price || 0)), 'Rp', 0) }}
            </template>
            <template v-else>
              {{ formatCurrency(Number(item.subtotal || 0), 'Rp', 0) }}
            </template>
          </div>
          <div class="grid-item">
            <template v-if="item.isEditing">
              <div style="display: flex; gap: 8px;">
                <n-button @click="item.isNew ? handleRemoveNewItem(index) : handleCancelEdit(item)" size="small" text>
                  <n-icon size="18" color="var(--neutral-30)">
                    <CancelOutlined />
                  </n-icon>
                </n-button>
                <n-button @click="handleSaveItem(item)" size="small" text>
                  <n-icon size="18" color="var(--primary-20)">
                    <n-image src="/save-ic.svg" width="16" height="16" preview-disabled />
                  </n-icon>
                </n-button>
              </div>
            </template>
            <template v-else>
              <n-button @click="handleEditItem(item)" size="small" text>
                <n-image src="/pen.svg" width="16" height="16" preview-disabled />
              </n-button>
              <n-popconfirm
                placement="top"
                positive-text="Yes"
                negative-text="No"
                @positive-click="handleDeleteItem(item._id)"
              >
                <template #icon>
                  <n-icon color="red">
                    <AlertCircle />
                  </n-icon>
                </template>
                <template #trigger>
                  <n-button size="small" text>
                    <n-image src="/trash-ic.svg" width="16" height="16" preview-disabled />
                  </n-button>
                </template>
                Are you sure you want to delete this item?
              </n-popconfirm>
            </template>
          </div>
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; margin-top: 1rem; gap: 1rem">
        <n-button
          round
          size="small"
          style="background-color: var(--primary-20); color: white"
          @click="handleUpdateExpense"
        >
          {{ hasNewOrUpdatedItems ? 'Submit' : 'Update' }}
        </n-button>
        <n-popconfirm
          placement="left"
          positive-text="Yes"
          negative-text="No"
          @positive-click="handleDelete(currentExpenseId)"
        >
          <template #icon>
            <n-icon color="red">
              <AlertCircle />
            </n-icon>
          </template>
          <template #trigger>
            <n-button size="small" round style="background-color: red; color: white">
              Delete
            </n-button>
          </template>
          Are you sure you want to delete this expense?
        </n-popconfirm>
      </div>
    </div>
  </ChangeModal>

  <ChangeModal
    :isVisible="showExtractedDataModal"
    modalTitle="Extracted Expense Data"
    modalType="customize"
    :textOnly="false"
    :mask-closable="false"
    :formInputs="[]"
    @update:isVisible="showExtractedDataModal = $event"
    :style="{ width: windowWidth > 1420 ? '60vw' : '95vw' }"
  >
    <div style="width: 100%">
      <div style="display: flex; align-items: center; width: 100%">
        <div class="paragraph-16-semibold">Extracted Expense Data</div>
      </div>

      <div v-if="extractedData" style="display: flex; flex-direction: column; gap: 1rem">
        <!-- Expense Information -->
        <div class="expense-info">
          <div class="expense-info-grid">
            <div>
              <div class="paragraph-14-semibold" style="padding-bottom: 0.5rem">Name</div>
              <n-input v-model:value="editableExtractedData.name" placeholder="Input Name" class="paragraph-14-regular input-info" />
            </div>
            <div>
              <div class="paragraph-14-semibold" style="padding-bottom: 0.5rem">Vendor</div>
              <n-input v-model:value="editableExtractedData.vendorName" placeholder="Input Vendor Name" class="paragraph-14-regular input-info" />
            </div>
            <div>
              <div class="paragraph-14-semibold" style="padding-bottom: 0.5rem">Date</div>
              <n-input type="date" v-model:value="editableExtractedData.date" placeholder="" class="paragraph-14-regular input-info" />
            </div>
            <div>
              <div class="paragraph-14-semibold" style="padding-bottom: 0.5rem">Category</div>
              <n-select v-model:value="editableExtractedData.categoryId" :options="categories" filterable placeholder="Select Category" clearable class="paragraph-14-regular " />
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; padding-bottom: 1rem; gap: 1rem">
          <n-button round size="small" style="background-color: var(--primary-20); color: white" @click="handleAddNewItem">
            <n-icon>
              <CirclePlus />
            </n-icon>
            Add Item
          </n-button>
        </div>

        <div class="items-list-container">
          <div class="items-header">
            <div class="grid-item">Name</div>
            <div class="grid-item" style="padding-left: 1rem">Qty</div>
            <div class="grid-item">Price</div>
            <div class="grid-item">Subtotal</div>
            <div class="grid-item">Action</div>
          </div>

          <div v-for="(item, index) in editableExtractedData.items" :key="index" class="items-row">
            <div class="grid-item">
              <n-input v-model:value="item.name" placeholder="Item Name" class="paragraph-14-regular input-info" />
            </div>
            <div class="grid-item" style="padding-left: 1rem">
              <n-input v-model:value="item.quantity" placeholder="Quantity" @keydown="handleNumericInput" class="paragraph-14-regular input-info" />
            </div>
            <div class="grid-item">
              <n-input v-model:value="item.price" placeholder="Price" @keydown="handleNumericInput" class="paragraph-14-regular input-info">
                <template #prefix>Rp</template>
              </n-input>
            </div>
            <div class="grid-item" style="font-weight: bold; color: #1890ff">
              {{ formatCurrency((Number(item.quantity || 0) * Number(item.price || 0)), 'Rp', 0) }}
            </div>
            <div class="grid-item">
              <n-button @click="handleDeleteScannedItem(index)" size="small" text>
                <n-image src="/trash-ic.svg" width="16" height="16" preview-disabled />
              </n-button>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: 1rem; gap: 1rem">
          <n-button
            round
            size="small"
            style="background-color: var(--neutral-30); color: white"
            @click="handleCloseModal"
          >
            Close
          </n-button>
          <n-button
            round
            size="small"
            style="background-color: var(--primary-20); color: white"
            @click="handleProcessExtractedData(extractedData?.task?._id)"
          >
            Process
          </n-button>
        </div>
      </div>
    </div>
  </ChangeModal>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, h } from 'vue'
import { NTag, NIcon, NImage, NBadge, NTooltip, NButton, NPopconfirm, NInput , useNotification} from 'naive-ui'
import { AlertCircle, CirclePlus } from '@vicons/tabler'
import { CancelOutlined } from '@vicons/material'
import { debounce } from 'lodash'
import { formatNumber, formatCurrency, formatNumberWithSuffix } from '@/utils/formatter';

const notification = useNotification()
const previewImage = ref(null)
const dataTableRef = ref(null)
const fileInput = ref(null)
const isLoading = ref(false)
const loading = ref(false)
const checkedRowKeysRef = ref([])
const showAddModal = ref(false)
const showEditModal = ref(false)
const showItemsModal = ref(false)
const showAddItemForm = ref(false)
const showEditItemForm = ref(false)
const selectedItems = ref([])
const currentExpenseId = ref(null)
const currentItemId = ref(null)
const categories = ref([])
const showExtractedDataModal = ref(false)
const extractedData = ref(null)
const editableExtractedData = ref(null)
const currentExpense = ref({
  name: '',
  vendorName: '',
  date: '',
  items: []
})
const newItem = ref({
  name: '',
  quantity: 1,
  price: 0
})

const windowWidth = ref(window.innerWidth)

const resetForm = () => {
  newItem.value = {
    name: '',
    quantity: 1,
    price: 0
  }
}


const handleCheck = (rowKeys) => {
  checkedRowKeysRef.value = rowKeys
}

const formValue = ref({
  category: null,
  date: '',
  name: '',
  vendorName: ''
})

const editFormValue = ref({
  category: null,
  date: '',
  name: '',
  vendorName: ''
})

const handleAdd = () => {
  showAddModal.value = true
}

const handleShowEdit = async (row) => {
  showEditModal.value = true
  const date = new Date(row.date)
  const formattedDate = date.toISOString().split('T')[0]

  editFormValue.value = {
    _id: row.id,
    category: row.categoryId,
    date: formattedDate,
    name: row.name,
    vendorName: row.vendorName
  }
}

const handleShowItems = (items, expenseId) => {
  selectedItems.value = Array.isArray(items) ? items : [items]
  currentExpenseId.value = expenseId

  // Reset currentExpense to default values
  currentExpense.value = {
    name: '',
    vendorName: '',
    date: '',
    items: []
  }

  // Fetch expense details
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
    })

  showItemsModal.value = true
}

const columns = computed(() => [
  {
    title: 'ID',
    key: 'id'
  },
  {
    title: 'Category',
    key: 'category'
  },
  {
    title: 'Date',
    key: 'date',
    render(row) {
      const date = new Date(row.date)
      const day = String(date.getDate()).padStart(2, '0')
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
      const month = monthNames[date.getMonth()]
      const year = date.getFullYear()

      return h('span', null, `${day} ${month} ${year}`)
    },
    className: 'formatNumber',
    width: '10%'
  },
  {
    title: 'Name',
    key: 'name'
  },
  {
    title: 'Vendor Name',
    key: 'vendorName'
  },
  {
    title: 'Total Amount',
    key: 'totalAmount',
    render(row) {
      return h('span', null, formatCurrency(row.totalAmount , 'Rp', 0))
    },
    className: 'formatNumber'
  },
  {
    title: 'Photo',
    key: 'photo'
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

const fetchExpenses = async (page, pageSize, updateLoading) => {
  try {
    if (typeof updateLoading === 'function') {
      updateLoading(true)
    }
    const params = {
      page: page,
      limit: pageSize,
      // ...(sort.sortBy && sort.sortOrder ? { sortBy: `${sort.sortBy}:${sort.sortOrder}` } : {})
    }
    const response = await useApi().get('/expenses', params)
    const data = response?.data?.data?.map((item) => ({
      id: item?._id,
      category: item?.category?.name,
      categoryId: item?.category?._id,
      date: item?.date,
      name: item?.name,
      vendorName: item?.vendorName,
      totalAmount: item?.totalAmount,
      photo: item?.photo,
      items: item?.items
    }))

    return {
      data: data,
      meta: {
        page: response?.data?.page,
        pageSize: response?.data?.pageSize,
        totalPages: response?.data?.totalPages,
        totalResults: response?.data?.totalResults
      }
    }
  } catch (error) {
    if (typeof updateLoading === 'function') {
      updateLoading(false)
    }
    console.error('Error fetching expenses:', error)
    return {
      data: [],
      meta: {
        page: 1,
        pageSize,
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

const fetchCategories = async (page, pageSize, updateLoading) => {
  try {
    if (typeof updateLoading === 'function') {
      updateLoading(true)
    }
    const response = await useApi().get('/categories')
    categories.value = response.data.map((item) => ({
      label: item.name,
      value: item._id
    }))

    return {
      data: categories.value,
      meta: {
        page: 1,
        pageSize: categories.value.length,
        totalPages: 1,
        totalResults: categories.value.length
      }
    }
  } catch (error) {
    if (typeof updateLoading === 'function') {
      updateLoading(false)
    }
    console.error('Error fetching categories:', error)
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

const handleSubmit = async () => {
  try {
    const response = await useApi().post('/expenses', {
      ...formValue.value,
      date: formValue.value.date ? new Date(formValue.value.date).toISOString() : null
    })

    formValue.value = {
      category: null,
      date: '',
      name: '',
      vendorName: ''
    }
    showAddModal.value = false
    dataTableRef.value?.refresh()
  } catch (error) {
    console.error('Error adding expense:', error)
  }
}

const handleEditSubmit = async () => {
  try {
    await useApi().patch(`/expenses/${editFormValue.value._id}`, {
      category: editFormValue.value.category,
      date: editFormValue.value.date ? new Date(editFormValue.value.date).toISOString() : null,
      name: editFormValue.value.name,
      vendorName: editFormValue.value.vendorName
    })

    showEditModal.value = false
    dataTableRef.value?.refresh()
  } catch (error) {
    console.error('Error updating expense:', error)
  }
}

const handleSearch = debounce(async (query) => {
  if (!query.length) {
    await fetchCategories()
    return
  }

  try {
    const response = await useApi().get(`/categories?search=${query}`)
    categories.value = response.data.map((item) => ({
      label: item.name,
      value: item._id
    }))
  } catch (error) {
    console.error('Error searching categories:', error)
    categories.value = []
  }
}, 500)

const handleEditItem = (item) => {
  item.originalData = { ...item }
  item.isEditing = true
}

const handleSaveItem = (item) => {
  item.subtotal = Number(item.quantity || 0) * Number(item.price || 0)
  
  item.isEditing = false
  
  if (!item.isNew) {
    item.isUpdated = true
  }
}

const handleCancelEdit = (item) => {
  if (item.originalData) {
    Object.assign(item, item.originalData)
    delete item.originalData
  }
  item.isEditing = false
}

const handleDeleteItem = async (itemId) => {
  try {
    await useApi().del(`/expenses/${currentExpenseId.value}/items/${itemId}`)
    selectedItems.value = selectedItems.value.filter((item) => item._id !== itemId)
    dataTableRef.value?.refresh()
    await useApi().get(`/expenses/${currentExpenseId.value}`)
  } catch (error) {
    console.error('Error deleting item:', error)
  }
}

const handleDelete = async (expenseId) => {
  try {
    await useApi().del(`/expenses/${expenseId}`)
    showItemsModal.value = false
    dataTableRef.value?.refresh()
  } catch (error) {
    console.error('Error deleting expenses:', error)
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileInputChange = async (event) => {
  const file = event.target.files[0]
  if (file) {
    // Check for valid file extensions
    const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!validFileTypes.includes(file.type)) {
      notification.error({
        title: 'Error',
        content: 'Please upload only JPG, JPEG, or PNG files',
        duration: 3000
      })
      event.target.value = ''
      return
    }
    
    const formData = new FormData()
    formData.append('file', file)

    try {
      isLoading.value = true
      const response = await useApi().post('/ai/extract-expense', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      extractedData.value = response?.data
      const formattedData = JSON.parse(JSON.stringify(response?.data?.data))
      if (formattedData.date) {
        const date = new Date(formattedData.date)
        formattedData.date = date.toISOString().split('T')[0]
      }
      // Find category ID from the extracted category name
      if (formattedData.category) {
        const category = categories.value.find((cat) => cat.label === formattedData.category)
        formattedData.categoryId = category ? category.value : null
      }
      // Ensure items array exists and has the correct structure
      if (formattedData.items) {
        formattedData.items = formattedData.items.map((item) => ({
          name: item.name || '',
          quantity: Number(item.quantity) || 1,
          price: Number(item.price) || 0
        }))
      } else {
        formattedData.items = []
      }
      editableExtractedData.value = formattedData
      showExtractedDataModal.value = true
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      isLoading.value = false
      event.target.value = ''
    }
  }
}

const handleCloseModal = () => {
  showExtractedDataModal.value = false
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleProcessExtractedData = async (id) => {
  try {
    isLoading.value = true

    const processedData = {
      type: 'ADD_EXPENSE',
      args: {
        name: editableExtractedData.value.name,
        date: editableExtractedData.value.date,
        vendorName: editableExtractedData.value.vendorName,
        category: editableExtractedData.value.categoryId,
        items: editableExtractedData.value.items.map((item) => ({
          name: item.name,
          quantity: Number(item.quantity),
          price: Number(item.price)
        }))
      },
      oldData: null,
      newData: null
    }

    console.log(processedData, '<<<<<<<')

    await useApi().patch(`/tasks/${id}/edit`, {
      data: processedData
    })

    await useApi().post(`/tasks/${id}/run`, {
      data: processedData
    })
    showExtractedDataModal.value = false
    dataTableRef.value?.refresh()
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } catch (error) {
    console.error('Error processing expense:', error)
  } finally {
    isLoading.value = false
  }
}

const handleAddNewItem = () => {
  if (!editableExtractedData.value.items) {
    editableExtractedData.value.items = []
  }
  editableExtractedData.value.items.unshift({
    name: '',
    quantity: 1,
    price: 0
  })
}

const handleDeleteScannedItem = (index) => {
  editableExtractedData.value.items.splice(index, 1)
}

const handleNumericInput = (e) => {
  // Allow: backspace, delete, tab, escape, enter, decimal point
  if (
    [46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    (e.keyCode === 65 && e.ctrlKey === true) ||
    (e.keyCode === 67 && e.ctrlKey === true) ||
    (e.keyCode === 86 && e.ctrlKey === true) ||
    (e.keyCode === 88 && e.ctrlKey === true) ||
    // Allow: home, end, left, right
    (e.keyCode >= 35 && e.keyCode <= 39)
  ) {
    return
  }
  // Ensure that it is a number and stop the keypress
  if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
    e.preventDefault()
  }
}

const handleUpdateExpense = async () => {
  try {
    // Update expense details
    await useApi().patch(`/expenses/${currentExpenseId.value}`, {
      name: currentExpense.value.name,
      vendorName: currentExpense.value.vendorName,
      date: currentExpense.value.date ? new Date(currentExpense.value.date).toISOString() : null
    })

    // Handle new items that need to be created
    const newItems = selectedItems.value.filter(item => item.isNew)
    for (const item of newItems) {
      await useApi().post(`/expenses/${currentExpenseId.value}/items`, {
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })
    }

    // Handle updated existing items
    const updatedItems = selectedItems.value.filter(item => item.isUpdated && !item.isNew)
    for (const item of updatedItems) {
      await useApi().patch(`/expenses/${currentExpenseId.value}/items/${item._id}`, {
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })
    }

    notification.success({
      title: 'Success',
      content: 'Expense updated successfully',
      duration: 3000
    })

    // Refresh the table and close modal
    dataTableRef.value?.refresh()
    showItemsModal.value = false
  } catch (error) {
    console.error('Error updating expense:', error)
    notification.error({
      title: 'Error',
      content: 'Failed to update expense',
      duration: 3000
    })
  }
}

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

const handleAddNewItemRow = () => {
  const newEmptyItem = {
    name: '',
    quantity: 1,
    price: 0,
    subtotal: 0,
    isEditing: true,
    isNew: true,
    isUpdated: false
  }
  selectedItems.value.unshift(newEmptyItem)
}

const handleRemoveNewItem = (index) => {
  selectedItems.value.splice(index, 1)
}

const hasNewOrUpdatedItems = computed(() => {
  return selectedItems.value.some(item => item.isNew || item.isUpdated)
})

const handleModalClose = () => {
  // Reset any items with changes
  for (const item of selectedItems.value) {
    if (item.isUpdated && item.originalData) {
      Object.assign(item, item.originalData)
    }
  }
  
  // Remove any new items that haven't been saved to server
  selectedItems.value = selectedItems.value.filter(item => !item.isNew)
  
  // Reset the expense to original state if there's originalData
  if (currentExpense.value.originalData) {
    const { originalData, ...rest } = currentExpense.value
    currentExpense.value = { ...originalData }
  }
  
  showItemsModal.value = false
}

onMounted(async () => {
  isLoading.value = false
  await fetchExpenses()
  await fetchCategories()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.grid-item {
  width: 100%;
  margin-bottom: 12px;
  gap: 1rem;
}

.selected-period {
  color: #1a9c4d;
}

.left-section {
  background-color: var(--background-color);
  border-radius: 30px;
  padding-left: 1.4rem;
  padding-bottom: 1.5rem;
  padding-right: 1.4rem;
  min-height: 89vh;
}

.right-section {
  background-color: white;
  border-radius: 30px;
  padding: 1.2rem;
  min-height: 89vh;
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

:deep(.n-image.n-image--preview-disabled img) {
  max-width: 40px !important;
  max-height: 40px !important;
  object-fit: contain !important;
}

@media screen and (max-width: 768px) {
  .container {
    background-color: var(--background-color-sec);
  }
}

@media (max-width: 1400px) {
  .left-section,
  .right-section {
    margin-bottom: 20px;
  }
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

.search-bar {
  margin-bottom: 1rem;
  margin-top: 1rem;
  width: 33%;
}

:deep(.n-input.n-input--resizable.n-input--stateful) {
  border-radius: 30px !important;
}

:deep(.n-input.n-input--textarea.n-input--resizable.n-input--stateful) {
  border-radius: 15px !important;
}

.file-upload-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  padding: 2rem;
  background-color: var(--background-color-sec);
  border-radius: 30px;
  border: 2px dashed var(--neutral-20);
  cursor: pointer;
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

.items-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid #eee;
  align-items: center;
  min-width: 600px;
}

.grid-item {
  display: flex;
  align-items: center;
  width: 100% !important;
}

.add-item-form {
  margin: 20px 0;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

:deep(.formatNumber) {
  text-align: right;
  align-items: flex-start;
}

.data-section {
  background-color: var(--background-color-sec);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.data-row {
  display: flex;
  gap: 1rem;
  padding: 0.5rem 0;
}

.data-row:last-child {
  border-bottom: none;
}

.label {
  font-weight: bold;
  min-width: 100px;
}

.value {
  color: var(--text-color);
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.input-info {
  background-color: var(--background-color-sec);
}

.loading-text {
  margin-top: 1rem;
  font-size: 1.2rem;
  color: var(--text-color);
  font-weight: 500;
}

:deep(.n-spin-content) {
  display: flex;
  flex-direction: column;
  align-items: center;
}

:deep(.n-spin-dot) {
  font-size: 32px;
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

@media screen and (max-width: 768px) {
  .expense-info-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}

:deep(.n-base-selection-label) {
  background-color: var(--background-color-sec) !important;
}

.item-with-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-tag {
  font-size: 10px;
  padding: 0 5px;
  height: 20px;
  line-height: 20px;
}
</style>
