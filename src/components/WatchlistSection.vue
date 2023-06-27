<script setup>
import AnimeCard from './AnimeCard.vue'

const props = defineProps({
  watchList: Array,
})

defineEmits(['selectAnime', 'clickDelete'])
</script>

<template>
  <div class="p-2">
    <h1 class="text-xl font-semibold
      text-gray-800 dark:text-white text-center">
      Watchlist
    </h1>

    <p v-if="watchList.length <= 0"
      class="mt-4 text-gray-800 dark:text-white text-center">
      No anime to watch yet
    </p>

    <div v-else>
      <!-- Cards -->
      <div class="mt-4 grid grid-cols-2 sm:grid-cols-3
        md:grid-cols-4 lg:grid-cols-5 gap-2">
        <AnimeCard v-for="item in watchList" :key="item.id"
          :id="item.id" :title="item.title"
          :image="item.image" :genres="[]" :deleteBtn="true"
          @click="$emit('selectAnime', item.id)"
          @clickDelete="$emit('clickDelete', item.id)" />
      </div>
    </div>
  </div>
</template>