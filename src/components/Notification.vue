<template>
  <n-popover
    trigger="click"
    :show-arrow="false"
    style="
      margin: 0 !important;
      border-radius: 0 0px 15px 15px;
      width: 22rem;
      padding: 0 !important;
    "
  >
    <template #trigger>
      <n-icon :component="NotificationsOutline" size="24" color="#AEAEAE" />
    </template>
    <div>
      <div class="notification-header">
        <div class="paragraph-16-semibold neutral-40">Notification</div>
      </div>
      <n-divider />
      <div class="notification-content">
        <div v-for="item in 3" :key="item">
          <div class="notification-content-item">
            <n-icon :component="NotificationsOutline" size="20" color="#AEAEAE" />
            <div class="paragraph-14-regular neutral-30">
              This is a long notification message that will wrap to the next line if it exceeds the
              width of the container.
            </div>
          </div>
          <n-divider style="padding: 0.1rem 0 0.5rem !important" />
        </div>
      </div>
    </div>
  </n-popover>
</template>
<script setup>
import { NotificationsOutline } from '@vicons/ionicons5'
import { h } from 'vue'
import { NIcon } from 'naive-ui'
const notificationOptions = [
  {
    label: () =>
      h(
        'div',
        {
          style:
            'display: flex; align-items: center; gap: 8px; width: 100%; height: 100%; margin-bottom: 1rem; cursor: pointer;border-bottom: 1px solid #e0e0e0;padding-bottom: 0.5rem;'
        },
        [
          h(NIcon, { component: NotificationsOutline, size: 16 }),
          h(
            'span',
            { style: 'white-space: normal;' },
            'This is a long notification message that will wrap to the next line if it exceeds the width of the container.'
          )
        ]
      ),
    key: 'notification-1'
  }
]
</script>
<style scoped>
.notification-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: -1rem;
  padding: 0.5rem;
}

.notification-content-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 1rem;
}
</style>
