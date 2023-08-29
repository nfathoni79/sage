<script setup>
import { ref, watch, onMounted } from 'vue'
import AnimeCard from '../components/AnimeCard.vue'
import Spinner from '../components/Spinner.vue'

import AnimeService from '../services/AnimeService'

const props = defineProps({
  windowLoaded: Boolean,
})

const topAiringList = ref([])
const loading = ref(false)

onMounted(() => {
  if (props.windowLoaded) getTopAiring()
})

watch(() => props.windowLoaded, newValue => {
  if (newValue) getTopAiring()
})

/**
 * Get top airing anime.
 */
const getTopAiring = () => {
  loading.value = true

  AnimeService.getTopAiring()
    .then(response => {
      topAiringList.value = response.data.results
    })
    .catch(error => {
      console.log(error)
    })
    .finally(() => {
      loading.value = false
    })
}

</script>

<template>
  <div class="p-2">
    <h1 class="text-xl font-semibold
      text-gray-800 dark:text-white text-center">
      Top Airing Anime
    </h1>

    <Spinner v-if="loading" class="mt-4 mx-auto h-8 w-8 text-blue-600" />
    
    <div v-else class="mt-4 grid grid-cols-2 sm:grid-cols-3
      md:grid-cols-4 lg:grid-cols-5 gap-2">
      <AnimeCard v-for="item in topAiringList" :key="item.id"
        :id="item.id" :title="item.title"
        :image="item.image" :genres="item.genres"
        @click="$router.push({ name: 'anime', params: { id: item.id } })" />
    </div>
  </div>
</template>