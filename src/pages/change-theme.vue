<template>
  <div class="container">
    <div class="header-container">
      <div class="header-semibold" style="color: var(--text-color)">Change Theme</div>
    </div>
    <div class="content">
      <div class="paragraph-16-semibold" style="color : var(--text-color)">Choose Theme Color:</div>
      <div class="color-picker">
        <n-avatar
            round
            size="medium"
            style="background-color: white; border: 1px solid var(--text-color); cursor: pointer"
            @click="changeTheme('light')"
          />
        <n-avatar
          round
          size="medium"
          style="background-color: rgb(16, 16, 20); border: 1px solid var(--text-color); cursor: pointer"
          @click="changeTheme('dark')"
        />
        <n-avatar
          round
          size="medium"
          style="background-color: #005F97; border: 1px solid var(--text-color); cursor: pointer"
          @click="changeTheme('blue')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { TrashAltRegular } from '@vicons/fa'
import { useGlobalStore } from '@/stores/global'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
const globalStore = useGlobalStore()

const changeTheme = (theme) => {
  globalStore.theme = theme
  localStorage.setItem('theme', theme)
}
</script>

<style scoped>
.container {
  min-height: 89vh;
  background-color: var(--background-color);
  border-radius: 30px;
  padding-left: 1.4rem;
  padding-top: 1.45rem;
  padding-right: 1.4rem;
  overflow-y: hidden;
}
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.color-picker {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1rem;
}

.content {
  padding: 1.5rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 2px solid var(--background-color-sec);
  border-radius: 15px;
  margin-top: 1rem;
}
.footer {
  display: flex;
  justify-content: flex-end;
  margin-top: -2rem;
}

@media (max-width: 500px) {
  .header-container {
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 1rem;
  }
}

@media (max-width: 340px) {
  .container {
    padding: 0;
  }
}
</style>
