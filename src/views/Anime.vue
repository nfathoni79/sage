<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { BookmarkIcon, BookmarkSlashIcon } from '@heroicons/vue/24/outline'
import Spinner from '../components/Spinner.vue'
import ABadge from '../components/ABadge.vue'
import AButton from '../components/AButton.vue'

import AnimeService from '../services/AnimeService'

const props = defineProps({
  inWatchlist: Boolean,
  lastEpisodeId: String,
})

const emit = defineEmits([
  'mountAnime',
  'changeEpisode',
  'changeQuality',
  'toggleWatchlist'
])

const route = useRoute()

// Fetched data
const animeInfo = ref(null)
const sources = ref([])

// Form fields
const episodeId = ref(null)
const quality = ref(null)

// Flags
const loading = ref(false)
const useShortDesc = ref(true)

const audioInfo = computed(() => {
  if (!animeInfo.value) return ''

  const subOrDub = animeInfo.value.subOrDub

  return (subOrDub == 'dub') ? 'EN' : 'JP'
})

const dynamicDescription = computed(() => {
  if (!animeInfo.value) return ''

  return useShortDesc.value
    ? animeInfo.value.description.substring(0, 200)
    : animeInfo.value.description
})

const streamUrl = computed(() => {
  return sources.value.filter(item => {
    return item.quality === quality.value
  })[0].url
})

onMounted(() => {
  emit('mountAnime', route.params.id)
  getAnimeInfo()
})

watch(() => props.lastEpisodeId, newLastEpisodeId => {
  // Set last episode id from watchlist if exist
  if (newLastEpisodeId != null && newLastEpisodeId != '') {
    episodeId.value = newLastEpisodeId
  } else if (animeInfo.value != null) {
    episodeId.value = animeInfo.value.episodes[0].id
  }

  if (episodeId.value != null) {
    emit('changeEpisode', episodeId.value)
    getSources()
  }
})

watch(sources, newSources => {
  if (newSources.length > 0) {
    quality.value = newSources[0].quality
    emit('changeQuality', streamUrl.value)
  }
})

/**
 * Get anime info.
 */
const getAnimeInfo = () => {
  loading.value = true
  animeInfo.value = null

  AnimeService.getAnimeInfo(route.params.id)
    .then(response => {
      animeInfo.value = response.data
      animeInfo.value.id = route.params.id
      
      // Set last episode id from watchlist if exist
      if (props.lastEpisodeId == '') {
        episodeId.value = animeInfo.value.episodes[0].id
      } else if (props.lastEpisodeId != null) {
        episodeId.value = props.lastEpisodeId
      }

      if (episodeId.value != null) {
        emit('changeEpisode', episodeId.value)
        getSources()
      }
    }) 
    .catch(error => {
      console.log(error)
    })
    .finally(() => {
      loading.value = false
    })
}

/**
 * Get video quality sources of an episode.
 */
const getSources = () => {
  AnimeService.getStreamLink(episodeId.value)
    .then(response => {
      sources.value = response.data.sources.filter((source) => {
        return source.quality != 'backup' && source.quality != 'default'
      })
    }) 
    .catch(error => {
      console.log(error)
    })
}

/**
 * Toggle add or remove anime to Watchlist.
 */
const toggleWatchlist = () => {
  emit('toggleWatchlist', {
    id: animeInfo.value.id,
    title: animeInfo.value.title,
    image: animeInfo.value.image,
  })
}

/**
 * Select an episode.
 */
const changeEpisode = () => {
  emit('changeEpisode', episodeId.value)
  getSources()
}

/**
 * Select a quality.
 */
const changeQuality = () => {
  emit('changeQuality', streamUrl.value)
}
</script>

<template>
  <div class="mx-auto max-w-md p-2">
    <Spinner v-if="loading" class="mt-4 mx-auto h-8 w-8 text-blue-600" />

    <p v-else-if="!loading && !animeInfo"
      class="mt-4 text-gray-800 dark:text-white text-center">
      Anime not found
    </p>

    <div v-else>
      <!-- Title -->
      <div class="flex items-center gap-2">
        <h1 class="grow text-xl font-semibold text-gray-800 dark:text-white">
          {{ animeInfo?.title }}
        </h1>

        <AButton :color="inWatchlist ? 'red' : 'green'"
          @click="toggleWatchlist()">
          <component :is="inWatchlist ? BookmarkSlashIcon : BookmarkIcon"
            class="w-6 h-6" />
        </AButton>
      </div>

      <!-- Type and status -->
      <div class="mt-2 space-x-1">
        <ABadge color="red">{{ animeInfo?.type }}</ABadge>
        <ABadge color="orange">{{ audioInfo }}</ABadge>
        <ABadge color="green">{{ animeInfo?.status }}</ABadge>
      </div>

      <!-- Genres -->
      <div class="mt-2 space-x-1">
        <ABadge v-for="genre in animeInfo?.genres" :key="genre">
          {{ genre }}
        </ABadge>
      </div>

      <!-- Description -->
      <p class="mt-4 text-sm text-gray-800 dark:text-gray-400
        whitespace-pre-line">
        {{ dynamicDescription }}
        <a v-if="animeInfo?.description.length > 200"
          @click="useShortDesc = !useShortDesc"
          class="cursor-pointer text-blue-500">
          {{ useShortDesc ? 'More' : 'Less'}}
        </a>
      </p>

      <!-- Episode and Quality -->
      <div class="mt-2 flex items-center gap-2">
        <label for="episode"
          class="text-sm font-semibold text-gray-800 dark:text-white">
          Episode
        </label>
        <select id="episode" class="block w-full h-10
          rounded-full border-gray-300 dark:border-gray-600 shadow-sm
          bg-gray-50 dark:bg-gray-700
          text-gray-800 dark:text-white text-sm
          focus:outline-none focus:border-blue-300 dark:focus:border-blue-500
          focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500"
          v-model="episodeId"
          @change="changeEpisode()">
          <option v-for="episode in animeInfo?.episodes" :key="episode.id"
            :value="episode.id">
            {{ episode.number }}
          </option>
        </select>

        <label for="quality"
          class="text-sm font-semibold text-gray-800 dark:text-white">
          Quality
        </label>
        <select id="quality" class="block w-full h-10
          rounded-full border-gray-300 dark:border-gray-600 shadow-sm
          bg-gray-50 dark:bg-gray-700
          text-gray-800 dark:text-white text-sm
          focus:outline-none focus:border-blue-300 dark:focus:border-blue-500
          focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500"
          v-model="quality"
          @change="changeQuality()">
          <option v-for="source in sources" :key="source.quality"
            :value="source.quality">
            {{ source.quality }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>