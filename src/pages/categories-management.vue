<template>
  <div class="container">
    <n-grid x-gap="20" y-gap="20" cols="1" item-responsive>
      <n-gi class="left-section">
        <div style="display: flex; justify-content: space-between; align-items: center">
          <div class="header-semibold" style="color: var(--text-color);width: 100%;">Categories Management</div>
          <div style="width: 100%; display: flex; justify-content: right; align-items: center">
            <n-button
              round
              style="background-color: var(--primary-20); color: white"
              size="medium"
              @click="handleAdd"
            >
              <n-icon size="20" style="margin-right: 0.2rem">
                <CirclePlus />
              </n-icon>
              Add
            </n-button>
          </div>
        </div>
        <div class="left-section-content">
          <DataTable
            class="table"
            :queryFn="fetchCategories"
            :columns="columns"
            :loading="loading"
            :useCheckbox="false"
            @update:selectedRows="handleCheck"
            ref="dataTableRef"
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
        <div class="header-semibold" style="padding-bottom: 2rem">Add Category</div>

        <n-form ref="formRef" :model="formValue" :rules="rules" :size="size">
          <n-form-item label="Name" path="name">
            <n-input v-model:value="formValue.name" placeholder="Input Name" />
          </n-form-item>
          <n-form-item label="Description" path="description">
            <n-input
              v-model:value="formValue.description"
              placeholder="Input Description"
              type="textarea"
            />
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
        <div style="padding-bottom: 2rem" class="paragraph-16-semibold">Edit Category</div>
        <n-form ref="editFormRef" :model="editFormValue" :rules="rules" :size="size">
          <n-form-item label="Name" path="name">
            <n-input v-model:value="editFormValue.name" placeholder="Input Name" />
          </n-form-item>
          <n-form-item label="Description" path="description">
            <n-input
              v-model:value="editFormValue.description"
              placeholder="Input Description"
              type="textarea"
            />
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
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, h } from 'vue'
import { NTag, NIcon, NImage, NBadge, NTooltip, NButton, NPopconfirm } from 'naive-ui'
import { AlertCircle, CirclePlus } from '@vicons/tabler'
const dataTableRef = ref(null)
const loading = ref(false)
const checkedRowKeysRef = ref([])
const showAddModal = ref(false)
const showEditModal = ref(false)
const editFormValue = ref({
  name: '',
  description: ''
})
const token = ref(localStorage.getItem('access_token'))
const handleCheck = (rowKeys) => {
  checkedRowKeysRef.value = rowKeys
}

const formValue = ref({
  name: '',
  description: ''
})

const handleAdd = () => {
  showAddModal.value = true
}

const handleSubmit = async () => {
  try {
    const response = await useApi().post('/categories', {
      name: formValue.value.name,
      description: formValue.value.description
    })

    formValue.value = {
      name: '',
      description: ''
    }
    showAddModal.value = false
    dataTableRef.value?.refresh()
  } catch (error) {
    console.error('Error adding category:', error)
  }
}

const handleDelete = async (id) => {
  try {
    if (!id) {
      console.error('No items selected for deletion')
      return
    }

    await useApi().del(`/categories/${id}`)

    dataTableRef.value?.refresh()
  } catch (error) {
    console.error('Error deleting categories:', error)
  }
}

const handleEdit = (row) => {
  editFormValue.value = {
    _id: row._id,
    name: row.name,
    description: row.description
  }
  showEditModal.value = true
}

const handleEditSubmit = async () => {
  try {
    if (!editFormValue.value._id) {
      console.error('Category ID is missing')
      return
    }

    const response = await useApi().patch(`/categories/${editFormValue.value._id}`, {
      name: editFormValue.value.name,
      description: editFormValue.value.description
    })

    showEditModal.value = false
    dataTableRef.value?.refresh()
  } catch (error) {
    console.error('Error updating category:', error)
  }
}

const columns = computed(() => [
  {
    title: 'ID',
    key: 'id'
  },
  {
    title: 'Name',
    key: 'name',
    sorter: true
  },
  {
    title: 'Description',
    key: 'description',
    sorter: true
  },
  {
    title: 'Action',
    key: 'action',
    width: '7%',
    render(row) {
      return h(
        'div',
        {
          style: {
            display: 'flex',
            gap: '1rem'
          }
        },
        [
          h(
            NButton,
            {
              circle: true,
              size: 'small',
              text: true,
              onClick: () => handleEdit(row)
            },
            {
              default: () =>
                h(NImage, {
                  width: '16',
                  height: '16',
                  src: '/pen.svg',
                  previewDisabled: true
                })
            }
          ),
          h(
            NPopconfirm,
            {
              positiveText: 'Yes',
              negativeText: 'No',
              onPositiveClick: () => handleDelete(row._id)
            },
            {
              icon: () => h(NIcon, { color: 'red' }, { default: () => h(AlertCircle) }),
              trigger: () =>
                h(
                  NButton,
                  {
                    circle: true,
                    size: 'small',
                    text: true
                  },
                  {
                    default: () =>
                      h(NImage, {
                        width: '16',
                        height: '16',
                        src: '/trash-ic.svg',
                        previewDisabled: true
                      })
                  }
                ),
              default: () => 'Are you sure you want to delete this item?'
            }
          )
        ]
      )
    }
  }
])

const fetchCategories = async (page, pageSize, updateLoading , sort={}) => {
  try {
    if (typeof updateLoading === 'function') {
      updateLoading(true)
    }
    const params = {
      page,
      limit: pageSize,
      ...(sort.sortBy && sort.sortOrder ? { sortBy: `${sort.sortBy}:${sort.sortOrder}` } : {})
    }
    const response = await useApi().get('/categories', params )
    const data = response.data.results.map((item) => ({
      _id: item._id,
      id: item._id,
      name: item.name,
      description: item.description
    }))

    return {
      data: data,
      meta: {
        page: response.data.page,
        pageSize: response.data.limit,
        totalPages: response.data.totalPages,
        totalResults: response.data.totalResults,
        sortBy: sort.sortBy,
        sortOrder: sort.sortOrder
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
        totalResults: 0,
        sortBy: '',
        sortOrder: ''
      }
    }
  } finally {
    if (typeof updateLoading === 'function') {
      updateLoading(false)
    }
  }
}

onMounted(() => {
  fetchCategories()
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
  background-color: var(--background-color);
  border-radius: 30px;
  padding-left: 1.4rem;
  padding-top: 1.5rem;
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

@media (max-width: 768px) {
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

:deep(.n-input.n-input--resizable.n-input--stateful) {
  border-radius: 30px !important;
}

:deep(.n-input.n-input--textarea.n-input--resizable.n-input--stateful) {
  border-radius: 15px !important;
}
</style>
