<template>
  <n-config-provider :theme-overrides="currentTheme">
    <n-notification-provider>
      <RouterView :style="themeStyles"/>
      <AgentAi />
    </n-notification-provider>
  </n-config-provider>
</template>

<script setup>
import { darkTheme,lightTheme } from 'naive-ui'
import { computed } from 'vue'
import { useGlobalStore } from '@/stores/global'

const globalStore = useGlobalStore()

const blueTheme = {
  common : {
    //base color
    baseColor: '#005F97',
    bodyColor: "#005F97",
    //text
    textColorBase: "#fff",
    textColor1: "rgba(255, 255, 255, 0.9)",
    textColor2: "rgba(255, 255, 255, 0.82)",
    textColor3: "rgba(255, 255, 255, 0.52)",

    //background modal dan popup
    popoverColor: "#005F97",
    modalColor: "#005F97",

    //table
    tableColor: "#005F97",
    cardColor: "#005F97",
    tableHeaderColor: "#1BB3E5",
    tableColorHover: "#1BB3E5",

    //credit score
    infoColor: "#1BB3E5",
  }
}


const defaultTheme = {
  common : {
    primaryColor: '#1D9DDD',
    primaryColorHover: '#1D9DDD',
  }
}


const currentTheme = computed(() => {
  switch (globalStore.theme){
    case 'dark':
      return darkTheme
    case 'blue':
      return blueTheme
    default:
      return defaultTheme
  }
})

const themeStyles = computed (() => {
  switch (globalStore.theme){
    case 'dark':
      return {
        '--background-color': 'rgb(16, 16, 20)',
        '--background-color-sec': '#48484E',
        '--text-color': '#fff'
      }
      case 'blue':
        return {
          '--background-color': '#005F97',
          '--background-color-sec': '#1BB3E5',
          '--text-color': '#fff'
        } 
      default:
        return defaultTheme
  }
})


</script>
<style>
</style>
