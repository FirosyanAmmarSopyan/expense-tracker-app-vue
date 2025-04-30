<template>
  <n-input
    ref="inputRef"
    :placeholder="title"
    size="large"
    class="paragraph-16-regular"
    style="position: relative; z-index: 1; border-radius: 50px"
    v-model:value="searchQuery"
  >
    <template #prefix>
      <n-icon :component="IosSearch" size="22" />
    </template>
  </n-input>
</template>

<script setup>
import { ref, computed, defineProps, watch } from 'vue'
import { NIcon } from 'naive-ui'
import { IosSearch } from '@vicons/ionicons4'
import { debounce } from 'lodash'

const props = defineProps({
  title: {
    type: String,
    default: 'Search'
  }
})

const emit = defineEmits(['search'])
const searchQuery = ref('')

const debouncedSearch = debounce(async (search) => {
  searchQuery.value = search
  emit('search', search)
}, 300)

watch(searchQuery, (val) => {
  debouncedSearch(val)
})
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
</style>
  