<template>
  <div class="credits">
    <div class="credits-usage">
      <div class="credits-usage-title paragraph-14-semibold">Credit Usage</div>
    </div>
    <div class="credit-tips">
      <Tooltips
        placement="bottom"
        style="margin-top: 1rem"
        :icon="QuestionCircle20Regular"
        :icon-size="14"
      >
        <div class="paragraph-12-regular neutral-30">
          Credit Usage is based on the number of Research Agents you have activated. See "Knowledge
          Base" for more info by clicking on the user icon at the top right of your screen.
        </div>
      </Tooltips>
    </div>
    <div class="credits-usage-progress">
      <n-progress
        type="line"
        indicator-placement="inside"
        :height="20"
        rail-color="#C8C8C8"
        :percentage="creditPercentage"
        class="progress-bar"
      >
        <div class="paragraph-12-semibold neutral-00">
          {{ userCredits?.toLocaleString() }} / {{ totalCredits?.toLocaleString() }}
        </div>
      </n-progress>
    </div>
  </div>
</template>

<script setup>
import { QuestionCircle20Regular } from '@vicons/fluent'
import { useGlobalStore } from '@/stores/global'

const globalStore = useGlobalStore()
const totalCredits = computed(() => globalStore?.userData?.max_credits)
const userCredits = computed(() => globalStore?.userCredits)
const creditPercentage = computed(() => (userCredits.value / totalCredits.value) * 100)
</script>

<style scoped>
.credits {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.credit-tips {
  margin-top: 0.3rem;
}

.progress-bar {
  width: 248px;
}

.credits-usage-title {
  white-space: nowrap;
  color: var(--text-color);
}

:deep(
    .n-progress
      .n-progress-graph
      .n-progress-graph-line.n-progress-graph-line--indicator-inside
      .n-progress-graph-line-rail
      .n-progress-graph-line-indicator
  ) {
  margin-left: 5px;
}

:deep(.n-progress-graph-line-fill) {
  min-width: 10%;
}
</style>
