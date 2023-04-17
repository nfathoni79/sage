<script setup>
import { computed } from 'vue'
import ABadge from './ABadge.vue'
import LoadingImage from './LoadingImage.vue'

const props = defineProps({
  id: String,
  title: String,
  image: String,
  genres: Array,
})

const shortTitle = computed(() => {
  return props.title.substring(0, 36) + (props.title.length > 36 ? '...' : '')
})
</script>

<template>
  <a :title="title"
    class="rounded-lg shadow-lg
    border border-gray-200 dark:border-gray-700
    bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700
    overflow-hidden cursor-pointer">
    <div class="w-full aspect-square
      flex items-center justify-center bg-blue-100">
      <LoadingImage :url="image" :name="shortTitle"
        className="aspect-square object-cover" />
    </div>

    <div class="p-2">
      <h2 class="text-sm font-semibold text-gray-800 dark:text-white">
        {{ shortTitle }}
      </h2>

      <div v-if="genres.length > 0" class="mt-2 space-x-1">
        <ABadge v-for="genre in genres.slice(0, 2)" :key="genre">
          {{ genre }}
        </ABadge>
        
        <ABadge v-if="genres.length > 2" color="white">
          +{{ genres.length - 2 }}
        </ABadge>
      </div>
    </div>
  </a>
</template>