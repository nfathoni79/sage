<script setup>
import { ref, computed } from 'vue'

import AnimeCard from './AnimeCard.vue'
import Spinner from './Spinner.vue'
import ARadioGroup from './ARadioGroup.vue'

const props = defineProps({
  searchList: Array,
  loading: Boolean,
})

defineEmits(['selectAnime'])

const audio = ref('All')
const audioOptions = ['All', 'JP', 'EN']

const filteredSearchList = computed(() => {
  return props.searchList.filter((item) => {
    switch (audio.value) {
      case 'All':
        return true
      case 'JP':
        return item.subOrDub == 'sub'
      case 'EN':
        return item.subOrDub == 'dub'
      default:
        return true
    }
  })
})
</script>

<template>
  <div class="p-2">
    <h1 class="text-xl font-semibold
      text-gray-800 dark:text-white text-center">
      Search Results
    </h1>

    <Spinner v-if="loading" class="mt-4 mx-auto h-8 w-8 text-blue-600" />

    <p v-else-if="!loading && searchList.length <= 0"
      class="mt-4 text-gray-800 dark:text-white text-center">
      No result
    </p>

    <div v-else>
      <!-- Filter -->
      <div class="mt-2 flex items-center justify-center gap-2">
        <span class="text-sm font-semibold text-gray-800 dark:text-white">
          Audio
        </span>
        <ARadioGroup v-model="audio" group="audio" :options="audioOptions"
            class="flex gap-2" />
      </div>
      
      <!-- Cards -->
      <div class="mt-4 grid grid-cols-2 sm:grid-cols-3
        md:grid-cols-4 lg:grid-cols-5 gap-2">
        <AnimeCard v-for="item in filteredSearchList" :key="item.id"
          @click="$emit('selectAnime', item.id)"
          :id="item.id" :title="item.title"
          :image="item.image" :genres="[]" />
      </div>
    </div>
  </div>
</template>