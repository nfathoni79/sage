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
        bg-blue-500 dark:bg-blue-600
        hover:bg-blue-600 dark:hover:bg-blue-700
        text-blue-50
        focus:ring-blue-300 dark:focus:ring-blue-500
      `
    case 'cyan':
      return cntl`
        bg-cyan-500 dark:bg-cyan-600
        hover:bg-cyan-600 dark:hover:bg-cyan-700
        text-cyan-50
        focus:ring-cyan-300 dark:focus:ring-cyan-500
      `
    case 'red':
      return cntl`
        bg-red-500 dark:bg-red-600
        hover:bg-red-600 dark:hover:bg-red-700
        text-red-50
        focus:ring-red-300 dark:focus:ring-red-500
      `
    case 'green':
      return cntl`
        bg-green-500 dark:bg-green-600
        hover:bg-green-600 dark:hover:bg-green-700
        text-green-50
        focus:ring-green-300 dark:focus:ring-green-500
      `
    case 'orange':
      return cntl`
        bg-orange-500 dark:bg-orange-600
        hover:bg-orange-600 dark:hover:bg-orange-700
        text-orange-50
        focus:ring-orange-300 dark:focus:ring-orange-500
      `
    case 'black':
      return cntl`
        bg-gray-600 dark:bg-gray-700
        hover:bg-gray-700 dark:hover:bg-gray-800
        text-gray-50
        focus:ring-gray-300 dark:focus:ring-gray-500
      `
    case 'disabled':
      return cntl`
        bg-gray-600 dark:bg-gray-700
        text-gray-400 focus:ring-0
      `
    default:
      return cntl`
        bg-blue-500 dark:bg-blue-600
        hover:bg-blue-600 dark:hover:bg-blue-700
        text-blue-50
        focus:ring-blue-300 dark:focus:ring-blue-500
      `
  }
})
</script>

<template>
  <button
    :class="['inline-flex items-center justify-center',
    'rounded-full font-semibold focus:outline-none focus:ring-2',
    colorClasses, $attrs.disabled ? 'cursor-not-allowed' : '']">
    <slot></slot>
  </button>
</template>