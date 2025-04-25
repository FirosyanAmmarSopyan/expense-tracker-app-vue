<template>
  <n-modal
    :show="localVisible"
    @update:show="updateVisible"
    class="modal"
    style="display: flex; justify-content: center"
  >
    <n-card class="modal-card" :bordered="false" aria-modal="true">
      <div style="display: flex; justify-content: flex-end">
        <n-button
          v-if="modalType !== 'subs&billing' && !isChangeConfirmed"
          secondary
          text
          @click="closeModal"
        >
          <template #icon>
            <n-icon :component="Close" size="30" color="black" />
          </template>
        </n-button>
      </div>
      <div class="modal-content">
        <div v-if="modalType === 'customize'">
          <slot />
        </div>
        <div v-if="modalType === 'subs&billing'">
          <slot />
        </div>

        <div v-if="!isChangeConfirmed" style="text-align: center; padding: 0 1rem">
          <div v-if="!textOnly" class="paragraph-16-semibold">
            {{
              (() => {
                switch (modalType) {
                  case 'email':
                    return 'Email Change'
                  case 'companyName':
                    return 'Company Name Change'
                  case 'password':
                    return 'Password Change'
                  case 'companyUrl':
                    return 'Company URL Change'
                  case 'name':
                    return 'Name Change'
                  case 'phone':
                    return 'Phone Change'
                  case 'confirmationModal':
                    return `${modalTitle}`
                  default:
                    return ''
                }
              })()
            }}
          </div>
          <div style="display: flex; justify-content: center; margin-top: 1rem">
            <div class="text-large text-grey" v-if="modalType === 'companyUrl'" style="width: 80%">
              Enter a Company URL with a valid format to ensure correct access
            </div>
            <div class="text-large text-grey" v-if="modalType === 'phone'" style="width: 80%">
              Enter your active phone number to ensure the latest information
            </div>
            <div class="text-large text-grey" v-if="modalType === 'name'" style="width: 80%">
              Please enter your full name according to your official identity
            </div>
            <div class="text-large text-grey" v-if="modalType === 'companyName'" style="width: 80%">
              Please enter your Company Name according to your official identity
            </div>
            <div
              v-if="
                modalType === 'email' ||
                modalType === 'password' ||
                modalType === 'confirmationModal'
              "
              class="text-large text-grey"
            >
              We'll send an email to your new address with instructions on completing the change
            </div>
            <div v-if="modalType === 'confirmationModalPw'" class="text-large text-grey">
              We'll send reset password instruction to your email address ({{
                globalStore?.userData?.email
              }})
            </div>
          </div>
          <!-- Display error message if it exists -->
        </div>
        <div
          v-else
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            gap: 1rem;
          "
        >
          <n-icon :size="100" :component="CheckCircleOutlineRound" color="#3FAA6A" />
          <div
            v-html="confirmationMessage"
            style="text-align: center; margin-bottom: 1rem"
            class="text-large"
          ></div>
        </div>
        <n-grid
          v-if="!isChangeConfirmed && modalType !== 'customize' && modalType !== 'subs&billing'"
          :cols="1"
          style="gap: 1rem; margin-bottom: 1rem; padding: 0 2rem 1rem 2rem"
          :style="{ 'margin-top': modalType === 'company' ? '0' : '2rem' }"
        >
          <n-gi v-for="(input, index) in localFormInputs" :key="index">
            <div style="margin-bottom: 0.3rem" class="paragraph-14-semibold">{{ input.label }}</div>
            <input
              v-if="input.type === 'date'"
              type="date"
              v-model="input.value"
              :placeholder="input.placeholder || ''"
              :class="{ 'input-error': input.errorMessage }"
              style="width: 100%; border-radius: 50px; padding: 12px; border: 1px solid #e0e0e6"
              @input="handleDateChange($event, input)"
            />
            <n-input
              v-else-if="input.type !== 'select'"
              style="border-radius: 50px"
              v-model:value="input.value"
              :type="input.type"
              show-password-on="click"
              size="large"
              :placeholder="input.placeholder"
              :class="{ 'input-error': input.errorMessage }"
              @keydown="(event) => handleKeyDown(event, input.modalType)"
            >
              <template v-if="input.type === 'password'" #password-visible-icon>
                <n-icon :size="20">
                  <EyeOutline />
                </n-icon>
              </template>
              <template v-if="input.type === 'password'" #password-invisible-icon>
                <n-icon :size="20">
                  <EyeOffOutline />
                </n-icon>
              </template>
            </n-input>
            <span
              v-if="input.errorMessage"
              style="color: #ff3838; margin-left: 0.5rem; font-size: 12px"
            >
              {{ input.errorMessage }}
            </span>

            <n-select
              style="border-radius: 50px !important"
              v-if="input.type === 'select'"
              size="large"
              v-model:value="localSelectedValue"
              :options="selectOptions"
              :placeholder="input.placeholder"
              @update:value="(val) => updateSelectValue(val, input)"
            />
          </n-gi>

          <n-gi v-if="customBehavior" style="display: flex; justify-content: center; gap: 1rem">
            <div style="display: flex; gap: 1rem; justify-content: center">
              <n-button
                secondary
                style="width: 100%; border-radius: 50px; background-color: #9e9e9e; color: white"
                size="medium"
                @click="closeModal"
              >
                <div class="paragraph-16-semibold">Cancel</div>
              </n-button>
              <n-button
                secondary
                style="width: 100%; border-radius: 50px; background-color: #1a9c4d; color: white"
                size="medium"
                :disabled="isProcessing"
                @click="handleCustomBehavior"
              >
                <div class="paragraph-16-semibold">Confirm</div>
              </n-button>
            </div>
          </n-gi>
          <n-gi
            v-if="confirmationModal"
            style="
              display: flex;
              justify-content: center;
              gap: 1rem;
              font-size: 1.1rem;
              text-align: center;
            "
          >
            <span v-html="message"></span>
          </n-gi>
          <n-gi v-if="textOnly">
            <div class="message-textonly" v-html="message"></div>
          </n-gi>
          <n-gi
            v-else
            v-if="
              modalType !== 'confirmationModal' &&
              modalType !== 'customize' &&
              modalType !== 'subs&billing' &&
              modalType !== 'confirmationModalPw'
            "
            style="display: flex; justify-content: center; width: 100%; margin-top: 1rem"
          >
            <div style="display: flex; gap: 1rem; justify-content: center; width: 48%">
              <n-button
                secondary
                style="width: 100%; border-radius: 50px; background-color: #9e9e9e; color: white"
                size="medium"
                @click="closeModal"
              >
                <div class="paragraph-16-semibold">Cancel</div>
              </n-button>
              <n-button
                secondary
                style="width: 100%; border-radius: 50px; background-color: #1a9c4d; color: white"
                size="medium"
                :disabled="isProcessing"
                @click="confirmChange"
              >
                <div class="paragraph-16-semibold">Confirm</div>
              </n-button>
            </div>
          </n-gi>
        </n-grid>
      </div>
    </n-card>
  </n-modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Close, Warning } from '@vicons/carbon'
import { EyeOutline, EyeOffOutline } from '@vicons/ionicons5'
import { CheckCircleOutlineRound } from '@vicons/material'
import { useGlobalStore } from '@/stores/global'
import axios from 'axios'

const globalStore = useGlobalStore()

const props = defineProps({
  isVisible: Boolean,
  modalTitle: String,
  modalType: String,
  formInputs: Array,
  customBehavior: Boolean,
  textOnly: Boolean,
  message: String,
  errorMessage: String
})

const emit = defineEmits(['update:isVisible', 'confirmChange', 'errorOccurred'])
const localVisible = ref(props.isVisible)
const selectedDate = ref(null)
const localFormInputs = ref(
  JSON.parse(JSON.stringify(props.formInputs)).map((input) => {
    if (input.type === 'select' && !input.value) {
    }
    return input
  })
)
watch(
  () => props.isVisible,
  (newValue) => {
    localVisible.value = newValue
  }
)

watch(
  () => props.formInputs,
  (newValue) => {
    localFormInputs.value = JSON.parse(JSON.stringify(newValue)).map((input) => {
      if (input.type === 'date' && input.value) {
        try {
          const date = new Date(input.value)
          if (!isNaN(date.getTime())) {
            selectedDate.value = date.getTime()
          }
        } catch (e) {
          selectedDate.value = null
        }
      }
      return input
    })
  },
  { deep: true }
)

const isChangeConfirmed = ref(false)
const isProcessing = ref(false)

const closeModal = () => {
  localFormInputs.value.forEach((input) => input.value)
  localVisible.value = false
  emit('update:isVisible', false)
  emit('update:errorMessage', '')
  localFormInputs.value.forEach((input) => (input.errorMessage = ''))
}

const updateVisible = (value) => {
  localVisible.value = value
  emit('update:isVisible', value)
}

watch(
  () => props.errorMessage,
  (newValue) => {
    if (newValue) {
    }
  }
)

const confirmChange = async () => {
  if (isProcessing.value) return
  isProcessing.value = true

  try {
    await validateInputs()

    if (localErrorMessage.value) {
      isChangeConfirmed.value = false
      emit('update:errorMessage', formatErrorMessage(localErrorMessage.value))
      return
    }

    const allValid = localFormInputs.value.every((input) => input.value && !input.errorMessage)
    if (!allValid) {
      isChangeConfirmed.value = false
      emit('update:errorMessage', formatErrorMessage('Some inputs are invalid'))
      return
    }

    emit('confirmChange', localFormInputs.value)

    isChangeConfirmed.value = true
    setTimeout(() => {
      isChangeConfirmed.value = false
    }, 1500)
  } finally {
    isProcessing.value = false
  }
}

const handleCustomBehavior = async () => {
  if (isProcessing.value) return
  isProcessing.value = true

  try {
    if (props.customBehavior) {
      emit('customBehaviorTriggered', true)
    }
    isChangeConfirmed.value = true
    setTimeout(() => {
      isChangeConfirmed.value = false
      closeModal()
    }, 1500)
  } finally {
    isProcessing.value = false
  }
}

const confirmationMessage = computed(() => {
  switch (props.modalType) {
    case 'email':
      return 'Check your email for instructions on completing the change!'
    case 'password':
      return 'Password change confirmed!'
    case 'companyUrl':
      return `URL change confirmed!
Please allow 24 hours for changes to reflect in your  instance.`
    case 'name':
      return 'Name change confirmed!'
    case 'phone':
      return 'Phone change confirmed!'
    case 'confirmationModalPw':
      return 'Email sent. Please check your inbox'
    default:
      return 'Change confirmed!'
  }
})

const validateInputs = async () => {
  for (const input of localFormInputs.value) {
    switch (input.modalType) {
      case 'name':
        if (!input.value) {
          input.errorMessage = `${input.label} cannot be empty`
        } else if (input.value.length > 50) {
          input.errorMessage = `${input.label} too long`
        } else if (/[^a-zA-Z ']/.test(input.value)) {
          input.errorMessage = `${input.label} cannot use special characters except ' and numbers`
        } else {
          input.errorMessage = '' // Validasi berhasil
        }
        break
      case 'companyName':
        if (!input.value) {
          input.errorMessage = `${input.label} cannot be empty`
        } else if (input.value.length > 50) {
          input.errorMessage = `${input.label} too long`
        } else if (/[^a-zA-Z0-9 '.,&-]/.test(input.value)) {
          input.errorMessage = `${input.label} can only contain letters, numbers, and symbols ( ' , . & - )`
        } else {
          input.errorMessage = ''
        }
        break

      case 'phone':
        if (!input.value) {
          input.errorMessage = `${input.label} cannot be empty`
        } else if (input.value.length < 9 || input.value.length > 12) {
          input.errorMessage = `${input.label} at least 9 numbers and max 12 numbers`
        } else {
          input.errorMessage = '' // Validasi berhasil
        }
        break

      case 'password':
        if (!input.value) {
          input.errorMessage = `${input.label} cannot be empty`
        } else {
          input.errorMessage = ''
        }
        break

      case 'email':
        if (!input.value) {
          input.errorMessage = `${input.label} cannot be empty`
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          // Validasi email
          input.errorMessage = `${input.label} invalid email address`
        } else {
          input.errorMessage = ''
        }
        break

      case 'companyUrl':
        if (!input.value) {
          input.errorMessage = `${input.label} cannot be empty`
        } else if (!(await validateUrl(input.value))) {
          input.errorMessage = `${input.label} is not a valid`
        } else if (!/^https?:\/\//.test(input.value)) {
          input.errorMessage = `${input.label} must start with https:// or http://`
        } else {
          input.errorMessage = ''
        }
        break
      case 'company':
        if (!input.value) {
          input.errorMessage = `${input.label} cannot be empty`
        } else {
          input.errorMessage = ''
        }
        break
      case 'date':
        if (!input.value) {
          input.errorMessage = `${input.label} cannot be empty`
        } else {
          input.errorMessage = ''
        }
        break
      case 'bigint':
        if (!input.value) {
          input.errorMessage = `${input.label} cannot be empty`
        } else {
          input.errorMessage = ''
        }
        break
      default:
        input.errorMessage = ''
        break
    }
  }
}
const handleKeyDown = (event, modalType) => {
  if (modalType === 'name') {
    if (event.key >= '0' && event.key <= '9') {
      event.preventDefault()
    }
  } else if (modalType === 'phone') {
    const inputValue = event.target.value
    if (event.key === '+' && inputValue.length > 0) {
      event.preventDefault()
    } else if (!/^[0-9+]*$/.test(event.key) && event.key !== 'Backspace') {
      event.preventDefault()
    }
  } else if (modalType === 'bigint') {
    if (!/^[0-9]*$/.test(event.key) && event.key !== 'Backspace') {
      event.preventDefault()
    } else {
      setTimeout(() => {
        const input = event.target
        const value = input.value.replace(/,/g, '')
        if (value) {
          input.value = new Intl.NumberFormat('en-US').format(parseInt(value))
        }
      }, 0)
    }
  }
}

const validateUrl = async (url) => {
  const response = await axios.post(import.meta.env.VITE_API_URL + '/companies/validate-url', {
    url: url
  })
  return response.data.isValid
}

const localErrorMessage = ref(props.errorMessage)

const formatErrorMessage = (message) => {
  const parts = message.split(':')
  return parts.length > 1 ? parts[1].trim() : message
}

const selectOptions = ref([
  {
    label: 'Select Ownership',
    value: null,
    disabled: true
  },
  {
    label: 'Private',
    value: 'Private'
  },
  {
    label: 'Public',
    value: 'Public'
  }
])

const handleDateChange = (event, input) => {
  const date = event.target.value
  if (date) {
    input.value = date
  } else {
    input.value = null
  }
}

const localSelectedValue = computed(() => {
  return globalStore.localSelectedValue
})

const updateSelectValue = (value, input) => {
  input.value = value
  globalStore.localSelectedValue = value
}
</script>

<style scoped>
.modal {
  border-radius: 30px;
  overflow: visible;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  margin-top: 2rem;
  width: 100%;
  position: fixed;
  left: 0;
  right: 0;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-card {
  width: 550px;
}

/* Untuk WebKit browsers (Chrome, Safari, dll) */
.modal-card::-webkit-scrollbar {
  display: none;
}

@media (max-width: 700px) {
  .modal-card {
    width: 90vw;
  }
}

.input-error {
  border: 2px solid #ff3838;
}

:deep(
    .n-input.n-input--resizable.n-input--round.n-input--focus.n-input--stateful.input-error:hover
  ) {
  border: 2px solid red;
}

:deep(.n-modal-mask) {
  background-color: rgb(248 248 248 / 60%);
}

:deep(.n-base-selection) {
  border-radius: 50px !important;
}

:deep(
    .n-base-select-option.n-base-select-option--selected.n-base-select-option--pending.n-base-select-option--show-checkmark::before
  ) {
  background-color: #e3faec !important;
  outline: 1px solid #1a9c4d !important;
  border-radius: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.n-base-icon.n-base-select-option__check) {
  display: none !important;
}

:deep(.n-base-select-menu .n-virtual-list) {
  max-height: 150px !important;
}

:deep(.n-base-selection.n-base-selection--selected) {
  border-radius: 50px !important;
}

:deep(.n-base-selection.n-base-selection--multiple) {
  border-radius: 50px !important;
}

:deep(.n-input.n-input--resizable.n-input--stateful) {
  border-radius: 50px !important;
}

input[type='date'] {
  appearance: none;
  -webkit-appearance: none;
  background-color: white;
}

input[type='date']::-webkit-calendar-picker-indicator {
  cursor: pointer;
  padding: 5px;
}

:deep(.n-card-header) {
  --n-padding-top: 0 !important;
}
:deep(.n-card__content) {
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer & Edge */
}

:deep(.n-date-panel.n-date-panel--date.n-date-panel--shadow) {
  position: relative !important;
  transform: translateX(1rem) !important;
}

:deep(.n-input.n-input--resizable.n-input--stateful.input-error) {
  border-radius: 50px !important;
  --n-border-focus: none !important;
  --n-border-hover: none !important;
}

:deep(.n-base-select-menu.n-select-menu) {
  width: 87% !important;
  margin-left: 1rem !important;
  border-radius: 0 0 10px 10px !important;
  padding-bottom: 0.3rem !important;
  margin-top: -1px !important;
}

:deep(.n-date-panel.n-date-panel--date.n-date-panel--shadow) {
  --n-panel-border-radius: 15px !important;
}

:deep(.n-base-select-menu .n-base-select-option::before) {
  border-radius: 0 !important;
  left: 1px !important;
  right: 1px !important;
}

:deep(.v-vl-items) {
  padding: 1px 0 1px 0 !important;
}
</style>
