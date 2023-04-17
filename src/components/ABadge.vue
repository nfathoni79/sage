<script setup>
import { computed } from 'vue'
import cntl from 'cntl'

const props = defineProps({
  color: String,
})

const colorClasses = computed(() => {
  switch (props.color) {
    case 'blue':
      return cntl`
        bg-blue-100 dark:bg-blue-900
        text-blue-800 dark:text-blue-300
      `
    case 'red':
      return cntl`
        bg-red-100 dark:bg-red-900
        text-red-800 dark:text-red-300
      `
    case 'green':
      return cntl`
        bg-green-100 dark:bg-green-900
        text-green-800 dark:text-green-300
      `
    case 'orange':
      return cntl`
        bg-orange-100 dark:bg-orange-900
        text-orange-800 dark:text-orange-300
      `
    case 'white':
      return cntl`border border-blue-100 dark:border-blue-900
        bg-white dark:bg-gray-800
        text-blue-800 dark:text-blue-300
      `
    default:
      return cntl`
        bg-blue-100 dark:bg-blue-900
        text-blue-800 dark:text-blue-300
      `
  }
})
</script>

<template>
  <span :class="['inline-block rounded-full px-2 py-0.5',
    'text-xs font-semibold', colorClasses]">
    <slot></slot>
  </span>
</template>