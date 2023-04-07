<script setup>
import AnimeCard from './AnimeCard.vue'
import Spinner from './Spinner.vue'

defineProps({
  topAiringList: Array,
  loading: Boolean,
})

defineEmits(['selectAnime'])
</script>

<template>
  <div class="p-2">
    <h1 class="text-xl font-semibold text-gray-800 text-center">
      Top Airing Anime
    </h1>

    <Spinner v-if="loading" class="mt-4 mx-auto h-8 w-8 text-blue-600" />
    
    <div v-else class="mt-4 grid grid-cols-2 gap-2">
      <AnimeCard v-for="item in topAiringList" :key="item.id"
        :id="item.id" :title="item.title"
        :image="item.image" :genres="item.genres"
        @click="$emit('selectAnime', item.id)" />
    </div>
  </div>
</template>