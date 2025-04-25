<template>
  <div style="display: flex; align-items: center; gap: 0.5rem">
    <n-popover
      placement="bottom"
      trigger="hover"
      :show-arrow="false"
      style="
        height: 100%;
        margin-top: 2px;
        border-radius: 0 0 10px 10px;
        box-shadow:
          0 3px 6px -4px rgba(0, 0, 0, 0.12),
          0 6px 16px 0 rgba(0, 0, 0, 0.08),
          0 9px 28px 8px rgba(0, 0, 0, 0.05);
        width: 230px;
        padding: 0px 0px !important;
        background-color: white;
      "
    >
      <template #trigger>
        <n-button
          secondary
          size="large"
          text
          class="paragraph-14-regular"
          style="
            outline: 1px solid #e2e4e7;
            border-radius: 50px;
            padding: 0.6rem 1rem;
            background-color: #f7f8f9;
            color: #6f757f;
            margin-top: 6px;
          "
        >
          <n-icon :component="AddCircleOutlineFilled" size="20" style="margin-right: 0.5rem" />
          {{ props.title }}
          <n-icon
            :component="ChevronDown20Filled"
            size="20"
            color="black"
            style="margin-left: 5rem"
          />
        </n-button>
      </template>
      <div style="display: flex; flex-direction: column; gap: 0.5rem">
        <n-infinite-scroll
          style="max-height: 300px"
          :distance="10"
          @load="handleLoad"
          trigger="none"
        >
          <div style="width: 100%">
            <n-empty
              v-if="valueTriggerOptions.length === 0"
              description="You can't find anything"
            ></n-empty>
            <div
              v-for="item in valueTriggerOptions"
              :key="item.value"
              style="
                cursor: pointer;
                font-size: 0.9rem;
                padding: 0.5rem 1rem;
                margin: 1px;
                transition: background-color 0.2s;
              "
              @click="handleSelectValueTrigger(item.value, item.label)"
              :style="{
                color: props.selectedValue.some((selected) => selected.value === item.value)
                  ? '#01913a'
                  : '#9E9E9E',
                backgroundColor: props.selectedValue.some(
                  (selected) => selected.value === item.value
                )
                  ? '#e0f7e0'
                  : 'transparent',
                outline: props.selectedValue.some((selected) => selected.value === item.value)
                  ? '1px solid #01913a'
                  : 'none'
              }"
              @mouseenter="$event.target.style.backgroundColor = '#f5f5f5'"
              @mouseleave="
                $event.target.style.backgroundColor = props.selectedValue.some(
                  (selected) => selected.value === item.value
                )
                  ? '#e0f7e0'
                  : 'transparent'
              "
            >
              {{ item.label.charAt(0).toUpperCase() + item.label.slice(1) }}
            </div>
            <div v-if="isLoadingMore" style="text-align: center; padding: 10px 0">
              <n-spin size="small" />
            </div>
          </div>
        </n-infinite-scroll>
      </div>
    </n-popover>
    <div
      style="display: flex; align-items: center; gap: 1rem"
      :style="{ paddingLeft: props.selectedValue.length > 0 ? '0.6rem' : '0' }"
    >
      <n-tag
        v-if="props.selectedValue.length > 0"
        v-for="item in props.selectedValue"
        :key="item.value"
        round
        :bordered="false"
        type="success"
        class="paragraph-11-semibold"
        style="border-radius: 30px; outline: 1px solid #01913a"
      >
        <div class="paragraph-11-semibold">
          {{
            (item.label.length > 5 ? item.label.slice(0, 5) + '...' : item.label)
              .charAt(0)
              .toUpperCase() +
            (item.label.length > 5 ? item.label.slice(0, 5) + '...' : item.label).slice(1)
          }}
        </div>
        <template #icon>
          <n-icon
            :component="CloseCircleOutline"
            size="14"
            @click="handleRemoveValueTrigger(item.value)"
          />
        </template>
      </n-tag>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CloseCircleOutline } from '@vicons/ionicons5'
import { FileDownloadOutlined, AddCircleOutlineFilled } from '@vicons/material'

import { ChevronDown20Filled } from '@vicons/fluent'
import { useNotification } from 'naive-ui'
const notification = useNotification()
const props = defineProps({
  queryFn: {
    type: Function,
    required: true
  },
  selectedValue: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: 'Value Trigger'
  }
})

const emit = defineEmits(['update:selectedValue'])

const valueTriggerOptions = ref([])
const isLoadingMore = ref(false)
const meta = ref({
  page: 1,
  totalPages: 0
})

const updateData = async (isLoadMore) => {
  if (props.queryFn) {
    const page = isLoadMore ? meta.value.page : 1
    const response = await props.queryFn(page)

    if (!response) return
    meta.value.page = response.page
    meta.value.totalPages = response.totalPages

    const transformedOptions = response.results.map((item) => ({
      label: item.value_name,
      value: item._id
    }))

    if (isLoadMore) {
      valueTriggerOptions.value.push(...transformedOptions)
    } else {
      valueTriggerOptions.value = transformedOptions
    }
  }
}

const handleLoad = async () => {
  try {
    if (meta.value.page < meta.value.totalPages) {
      isLoadingMore.value = true
      meta.value.page += 1
      await updateData(true)
    } else {
    }
  } catch (error) {
  } finally {
    isLoadingMore.value = false
  }
}

const handleSelectValueTrigger = (value, label) => {
  if (!props.selectedValue.some((item) => item.value === value)) {
    if (props.selectedValue.length < 3) {
      const newSelection = [...props.selectedValue, { value, label }]
      emit('update:selectedValue', newSelection)
    } else {
      notification.error({
        title: 'Error',
        content: 'You can only select up to 3 value triggers',
        duration: 2500
      })
    }
  }
}

const handleRemoveValueTrigger = (value) => {
  const newSelection = props.selectedValue.filter((item) => item.value !== value)
  emit('update:selectedValue', newSelection)
}

// Initial load
onMounted(async () => {
  await updateData(false)
})
</script>
<style scoped></style>
