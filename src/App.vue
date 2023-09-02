<script setup>
import { ref, computed, onMounted } from 'vue'
import Hls from 'hls.js/dist/hls.min'

import Preloader from './components/Preloader.vue'
import VideoSection from './components/VideoSection.vue'
import MenuSection from './components/MenuSection.vue'

const watchlist = ref([])
const animeId = ref(null)
const showControlsTimeout = ref(null)

// Flags
const windowLoaded = ref(false)
const playerActive = ref(false)
const sourceSet = ref(false)
const playing = ref(false)
const showControls = ref(false)

// Plyr
const plyrParent = ref(null)
const plyrOptions = {
  controls: [
    'play-large', 'rewind', 'play', 'fast-forward', 'progress', 'current-time',
    'mute', 'volume', 'fullscreen'
  ],
  fullscreen: {
    enabled: true,
    fallback: true,
    iosNative: true,
    container: '#custom-control-wrapper',
  },
}
const plyrCurrentTime = ref(0)

// HLS
let hls = new Hls()

/** CORS base URL */
const corsBaseUrl = import.meta.env.VITE_CORS_BASE_URL

/**
 * Plyr player instance.
 */
const plyrPlayer = computed(() => {
  return plyrParent.value.plyr.player
})

/**
 * Is current anime in Watchlist.
 */
const inWatchlist = computed(() => {
  if (animeId.value == null) return false

  const index = watchlist.value.findIndex(item => {
    return item.id == animeId.value
  })

  return index > -1
})

/**
 * Last Episode ID from Watchlist.
 * If none in Watchlist, return empty string.
 */
const lastEpisodeId = computed(() => {
  if (animeId.value == null) return null

  const filtered = watchlist.value.filter(item => {
    return item.id == animeId.value
  })

  return (filtered.length > 0) ? filtered[0].lastEpisodeId : ''
})

onMounted(() => {
  window.addEventListener( 'load', () => {
    windowLoaded.value = true
    getWatchlist()
  })

  plyrPlayer.value.on('loadeddata', () => {
    sourceSet.value = true
    plyrPlayer.value.currentTime = plyrCurrentTime.value
  })

  plyrPlayer.value.on('timeupdate', () => {
    if (sourceSet.value) {
      plyrCurrentTime.value = plyrPlayer.value.currentTime
    }
  })

  plyrPlayer.value.on('enterfullscreen', () => {
    screen.orientation.lock('landscape').catch(error => {
      console.log(error)
    })
  })

  plyrPlayer.value.on('exitfullscreen', () => {
    screen.orientation.unlock()
  })

  plyrPlayer.value.on('controlsshown', () => {
    resetShowControlsTimeout()
  })

  plyrPlayer.value.on('playing', () => {
    playing.value = true
  })

  plyrPlayer.value.on('pause', () => {
    playing.value = false
  })
})

/**
 * Get Watchlist anime.
 */
const getWatchlist = () => {
  watchlist.value = []
  const watchlistStr = localStorage.getItem('watchlist')

  if (watchlistStr != null) {
    watchlist.value = JSON.parse(watchlistStr)
  }
}

/**
 * Toggle add or remove anime to Watchlist.
 * @param {String} id - Anime ID. 
 * @param {String} title - Anime title. 
 * @param {String} image - Anime image URL. 
 */
const toggleWatchlist = (id, title, image) => {
  // Check if anime in watchlist
  const index = watchlist.value.findIndex(item => {
    return item.id == id
  })

  // Remove if exist, else add
  if (index > -1) {
    watchlist.value.splice(index, 1)
  } else {
    watchlist.value.push({ id, title, image, lastEpisodeId: null })
  }

  // Update localStorage
  localStorage.setItem('watchlist', JSON.stringify(watchlist.value))
}

/**
 * Update Watchlist from restored backup.
 * @param {Array} newWatchlist - New Watchlist from backup.
 */
const updateWatchlist = (newWatchlist) => {
  watchlist.value = newWatchlist
  localStorage.setItem('watchlist', JSON.stringify(watchlist.value))
}

/**
 * Set anime ID from child.
 * @param {String} id - Anime ID>
 */
const setAnimeId = (id) => animeId.value = id

/**
 * Update Watchlist and player when episode changed.
 * @param {String} id - Episode ID. 
 */
const onChangeEpisode = (id) => {
  // Check if anime in watchlist
  const index = watchlist.value.findIndex(item => {
    return item.id == animeId.value
  })

  // Update last episode in watchlist if exist
  if (index > -1) {
    watchlist.value[index].lastEpisodeId = id
    localStorage.setItem('watchlist', JSON.stringify(watchlist.value))
  }

  playerActive.value = true
  sourceSet.value = false
  plyrCurrentTime.value = 0
}

/**
 * Set HLS video source.
 * @param {String} streamUrl - Video stream URL.
 */
const setHlsSource = (streamUrl) => {
  if (Hls.isSupported()) {
    sourceSet.value = false
    const source = corsBaseUrl ? `${corsBaseUrl}/${streamUrl}` : streamUrl

    hls.destroy()
    hls = new Hls()
    hls.loadSource(source)
    hls.attachMedia(plyrPlayer.value.media)
    window.hls = hls
  }
}

/**
 * Reset the timeout of custom controls.
 */
const resetShowControlsTimeout = () => {
  showControls.value = true

  clearTimeout(showControlsTimeout.value)

  showControlsTimeout.value = setTimeout(() => {
    showControls.value = false
  }, 3000)
}

/**
 * Rewind playback from custom controls.
 */
const rewind = () => {
  resetShowControlsTimeout()
  plyrPlayer.value.rewind(10)
}

/**
 * Forward playback from custom controls.
 */
const forward = () => {
  resetShowControlsTimeout()
  plyrPlayer.value.forward(10)
}

/**
 * Pause playback from custom controls.
 */
const pause = () => {
  resetShowControlsTimeout()
  plyrPlayer.value.pause()
}

/**
 * Get current year.
 */
const getCurrentYear = () => {
  return new Date().getFullYear()
}
</script>

<template>
  <div class="mx-auto max-w-6xl bg-white dark:bg-gray-900">
    <Preloader :active="!windowLoaded" />
    
    <VideoSection ref="plyrParent"
      :active="playerActive" :sourceSet="sourceSet" :plyrOptions="plyrOptions"
      :showControls="showControls" :playing="playing"
      @rewind="rewind()" @forward="forward()" @pause="pause()" />

    <MenuSection />
    
    <router-view :windowLoaded="windowLoaded" :watchlist="watchlist"
      :inWatchlist="inWatchlist" :lastEpisodeId="lastEpisodeId"
      @mountAnime="animeId => setAnimeId(animeId)"
      @changeEpisode="episodeId => onChangeEpisode(episodeId)"
      @changeQuality="streamUrl => setHlsSource(streamUrl)"
      @removeWatchlist="id => toggleWatchlist(id, '', '')"
      @toggleWatchlist="({ id, title, image }) => toggleWatchlist(id, title, image)"
      @updateWatchlist="newWatchlist => updateWatchlist(newWatchlist)" />
    
    <div class="p-2 text-sm text-center text-gray-800 dark:text-white">
      <p>{{ `&copy; ${getCurrentYear()} ウィブ` }}</p>
    </div>
  </div>
</template>
