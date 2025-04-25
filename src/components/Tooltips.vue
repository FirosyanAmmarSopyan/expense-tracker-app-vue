<template>
  <n-tooltip
    trigger="hover"
    placement="right"
    :show-arrow="false"
    style="
      background-color: white;
      color: grey;
      width: 250px;
      font-size: 0.7rem;
      border-radius: 20px;
      margin-top: -1.3rem;
    "
  >
    <template #trigger>
      <n-icon :component="icon" :size="iconSize" :color="color" />
    </template>
    <slot></slot>
  </n-tooltip>
</template>

<script setup>
import { NTooltip, NIcon } from 'naive-ui'
import { QuestionCircle20Regular } from '@vicons/fluent'

const props = defineProps({
  icon: {
    type: Object,
    default: QuestionCircle20Regular
  },
  iconSize: {
    type: Number,
    default: 12
  },
  color: {
    type: String,
    default: 'grey'
  }
})
</script>
