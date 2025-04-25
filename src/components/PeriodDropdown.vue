<template>
  <div style="display: flex; align-items: center; gap: 0.5rem">
    <div class="paragraph-14-regular">Period :</div>
    <n-popover
      trigger="hover"
      :show-arrow="false"
      placement="bottom"
      style="border-radius: 0 0 10px 10px; padding: 0px 0px !important"
    >
      <template #trigger>
        <n-button secondary text icon-placement="right" class="paragraph-14-regular primary-20">
          <template #icon>
            <n-icon
              style="margin-top: 0.2rem"
              :component="CaretDownOutlined"
              size="1rem"
              color="#1A9C4D"
            />
          </template>
          {{
            selectedPeriod === 1
              ? '24 Hours'
              : selectedPeriod === 30
                ? '1 Month'
                : selectedPeriod === 60
                  ? '2 Months'
                  : selectedPeriod === 90
                    ? '3 Months'
                    : selectedPeriod === 120
                      ? '4 Months'
                      : selectedPeriod === 150
                        ? '5 Months'
                        : selectedPeriod === 180
                          ? '6 Months'
                          : selectedPeriod === 360
                            ? '1 Year'
                            : selectedPeriod === 720
                              ? '2 Year'
                              : selectedPeriod === 1080
                                ? '3 Year'
                                : `${selectedPeriod} Days`
          }}
        </n-button>
      </template>
      <n-scrollbar
        trigger="none"
        style="
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          border-radius: 0 0 10px 10px;
          max-height: 200px;
          overflow-y: hidden;
        "
      >
        <div
          v-for="period in optionsPeriod"
          :key="period.key"
          @click="handleSelectPeriod(period.key)"
          style="
            cursor: pointer;
            padding: 0.6rem 1rem;
            transition: background-color 0.2s;
            margin: 1px;
          "
          :style="{
            color: selectedPeriod === period.key ? '#01913a' : 'inherit',
            backgroundColor: selectedPeriod === period.key ? '#e0f7e0' : 'transparent',
            outline: selectedPeriod === period.key ? '1px solid #01913a' : 'none'
          }"
          @mouseenter="$event.target.style.backgroundColor = '#f5f5f5'"
          @mouseleave="
            $event.target.style.backgroundColor =
              selectedPeriod === period.key ? '#e0f7e0' : 'transparent'
          "
        >
          {{ period.label }}
        </div>
      </n-scrollbar>
    </n-popover>
  </div>
</template>
<script setup>
import { CaretDownOutlined } from '@vicons/antd'
import { useNotification } from 'naive-ui'

const props = defineProps({
  period: {
    type: Number,
    default: 30
  }
})

const notification = useNotification()
const emit = defineEmits(['update:period'])
const selectedPeriod = ref(props.period)

watch(
  () => props.period,
  (newValue) => {
    selectedPeriod.value = newValue
  }
)

watch(selectedPeriod, (newValue) => {
  emit('update:period', newValue)
})

const optionsPeriod = [
  {
    label: '24 Hours',
    key: 1
  },
  {
    label: '7 Days',
    key: 7
  },
  {
    label: '14 Days',
    key: 14
  },
  {
    label: '21 Days',
    key: 21
  },
  {
    label: '1 Month',
    key: 30
  },
  {
    label: '2 Month',
    key: 60
  },
  {
    label: '3 Month',
    key: 90
  },
  {
    label: '4 Month',
    key: 120
  },
  {
    label: '5 Month',
    key: 150
  },
  {
    label: '6 Month',
    key: 180
  },
  {
    label: '1 Year',
    key: 360
  },
  {
    label: '2 Year',
    key: 720
  },
  {
    label: '3 Year',
    key: 1080
  }
]

const handleSelectPeriod = async (key) => {
  selectedPeriod.value = key
}
</script>
