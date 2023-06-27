<script setup>
import { ref, computed, watch } from 'vue'
import { BookmarkIcon, BookmarkSlashIcon } from '@heroicons/vue/24/outline'
import Spinner from './Spinner.vue'
import ABadge from './ABadge.vue'
import AButton from './AButton.vue'

const props = defineProps({
  animeInfo: Object,
  sources: Array,
  loading: Boolean,
  inWatchlist: Boolean,
  lastEpisodeId: String,
})

const emit = defineEmits(['changeEpisode', 'changeQuality', 'toggleWatchlist'])

const short = ref(true)
const episodeId = ref(null)
const quality = ref(null)

const infoAudio = computed(() => {
  const subOrDub = props.animeInfo.subOrDub

  if (subOrDub == 'dub') {
    return 'EN'
  } else {
    return 'JP'
  }
})

const dynamicDescription = computed(() => {
  return short.value
    ? props.animeInfo.description.substring(0, 200)
    : props.animeInfo.description
})

const streamUrl = computed(() => {
  return props.sources.filter((item) => {
    return item.quality === quality.value
  })[0].url
})

watch(() => props.animeInfo, (newAnimeInfo) => {
  if (newAnimeInfo != null) {
    // Set last episode id from watchlist if exist
    episodeId.value = (props.lastEpisodeId == null)
      ? newAnimeInfo.episodes[0].id
      : props.lastEpisodeId

    emit('changeEpisode', {
      episodeId: episodeId.value,
      animeId: newAnimeInfo.id,
    })
  }
})

watch(() => props.sources, (newSources) => {
  if (newSources.length > 0) {
    quality.value = newSources[0].quality
    emit('changeQuality', streamUrl.value)
  }
})

const handleWatchlist = () => {
  emit('toggleWatchlist', {
    id: props.animeInfo.id,
    title: props.animeInfo.title,
    image: props.animeInfo.image,
  })
}
</script>

<template>
  <div class="mx-auto max-w-md p-2">
    <Spinner v-if="loading" class="mt-4 mx-auto h-8 w-8 text-blue-600" />

    <div v-else>
      <!-- Title -->
      <div class="flex items-center gap-2">
        <h1 class="grow text-xl font-semibold text-gray-800 dark:text-white">
          {{ animeInfo.title }}
        </h1>

        <AButton :color="inWatchlist ? 'red' : 'green'"
          @click="handleWatchlist()">
          <component :is="inWatchlist ? BookmarkSlashIcon : BookmarkIcon"
            class="w-6 h-6" />
        </AButton>
      </div>

      <!-- Type and status -->
      <div class="mt-2 space-x-1">
        <ABadge color="red">{{ animeInfo.type }}</ABadge>
        <ABadge color="orange">{{ infoAudio }}</ABadge>
        <ABadge color="green">{{ animeInfo.status }}</ABadge>
      </div>

      <!-- Genres -->
      <div class="mt-2 space-x-1">
        <ABadge v-for="genre in animeInfo.genres" :key="genre">
          {{ genre }}
        </ABadge>
      </div>

      <!-- Description -->
      <p class="mt-4 text-sm text-gray-800 dark:text-gray-400
        whitespace-pre-line">
        {{ dynamicDescription }}
        <a v-if="animeInfo.description.length > 200"
          @click="short = !short"
          class="cursor-pointer text-blue-500">
          {{ short ? 'More' : 'Less'}}
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
          @change="$emit('changeEpisode', { episodeId, animeId: animeInfo.id })">
          <option v-for="episode in animeInfo.episodes" :key="episode.id"
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
          @change="$emit('changeQuality', streamUrl)">
          <option v-for="source in sources" :key="source.quality"
            :value="source.quality">
            {{ source.quality }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>