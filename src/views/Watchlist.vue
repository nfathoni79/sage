<script setup>
import AnimeCard from '../components/AnimeCard.vue'

const props = defineProps({
  watchlist: Array,
})

const emit = defineEmits(['removeWatchlist'])

/**
 * Remove an anime from Watchlist.
 * @param {String} id - Anime ID. 
 */
const removeWatchlist = (id) => {
  emit('removeWatchlist', id)
}
</script>

<template>
  <div class="p-2">
    <h1 class="text-xl font-semibold
      text-gray-800 dark:text-white text-center">
      Watchlist
    </h1>

    <p v-if="watchlist.length <= 0"
      class="mt-4 text-gray-800 dark:text-white text-center">
      No anime to watch yet
    </p>

    <div v-else>
      <!-- Cards -->
      <div class="mt-4 grid grid-cols-2 sm:grid-cols-3
        md:grid-cols-4 lg:grid-cols-5 gap-2">
        <AnimeCard v-for="item in watchlist" :key="item.id"
          :id="item.id" :title="item.title"
          :image="item.image" :genres="[]" :deleteBtn="true"
          @click="$router.push({ name: 'anime', params: { id: item.id } })"
          @clickDelete="removeWatchlist(item.id)" />
      </div>
    </div>
  </div>
</template>