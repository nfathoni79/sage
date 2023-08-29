<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import AnimeCard from '../components/AnimeCard.vue'
import Spinner from '../components/Spinner.vue'
import ARadioGroup from '../components/ARadioGroup.vue'

import AnimeService from '../services/AnimeService'

const props = defineProps({
  windowLoaded: Boolean,
})

const route = useRoute()

const searchList = ref([])
const loading = ref(false)

const audio = ref('All')
const audioOptions = ['All', 'JP', 'EN']

onMounted(() => {
  if (props.windowLoaded) search()
})

watch(() => props.windowLoaded, newValue => {
  if (newValue) search()
})

watch(route, newRoute => {
  if (newRoute) search()
})

const filteredSearchList = computed(() => {
  return searchList.value.filter(item => {
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

/**
 * Search anime.
 */
const search = () => {
  if (!route.query.q) return

  loading.value = true
  searchList.value = []

  AnimeService.search(route.query.q)
    .then(response => {
      searchList.value = response.data.results
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
          @click="$router.push({ name: 'anime', params: { id: item.id } })"
          :id="item.id" :title="item.title"
          :image="item.image" :genres="[]" />
      </div>
    </div>
  </div>
</template>