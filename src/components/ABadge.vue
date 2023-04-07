<script setup>
import { computed } from 'vue'
import cntl from 'cntl'

const props = defineProps({
  color: String,
})

const colorClasses = computed(() => {
  switch (props.color) {
    case 'blue':
      return cntl`bg-blue-100 text-blue-800`
    case 'red':
      return cntl`bg-red-100 text-red-800`
    case 'green':
      return cntl`bg-green-100 text-green-800`
    case 'orange':
      return cntl`bg-orange-100 text-orange-800`
    case 'white':
      return cntl`border border-blue-100 bg-white text-blue-800`
    default:
      return cntl`bg-blue-100 text-blue-800`
  }
})
</script>

<template>
  <span :class="['inline-block rounded-full px-2 py-0.5',
    'text-xs font-semibold', colorClasses]">
    <slot></slot>
  </span>
</template>