<template>
  <n-button
    secondary
    :color="color === 'primary' ? '#168140' : color === 'secondary' ? '#8A949F' : ''"
    ><slot
  /></n-button>
</template>
<script setup>
defineProps({
  color: {
    type: String,
    default: 'primary'
  }
})
</script>
