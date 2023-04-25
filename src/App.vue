<script setup>
import { ref, computed, onMounted } from 'vue'
import Hls from 'hls.js/dist/hls.min'

import Preloader from './components/Preloader.vue'
import VideoSection from './components/VideoSection.vue'
import MenuSection from './components/MenuSection.vue'
import TopAiringSection from './components/TopAiringSection.vue'
import SearchSection from './components/SearchSection.vue'
import AnimeInfoSection from './components/AnimeInfoSection.vue'
import WatchlistSection from './components/WatchlistSection.vue'

import AnimeService from './services/AnimeService'

const menu = ref('home')
const windowLoaded = ref(false)
const loading = ref(false)
const sourceSet = ref(false)
const darkTheme = ref(false)

const topAiringList = ref([])
const searchList = ref([])
const watchList = ref([])
const animeInfo = ref(null)
const sources = ref([])

const plyrParent = ref(null)
const plyrOptions = {
  controls: [
    'play-large', 'rewind', 'play', 'fast-forward', 'progress', 'current-time',
    'mute', 'volume', 'fullscreen'
  ],
}
const plyrCurrentTime = ref(0)

let hls = new Hls()

const animeInfoId = computed(() => {
  return (animeInfo.value == null) ? null : animeInfo.value.id
})

const plyrPlayer = computed(() => {
  return plyrParent.value.plyr.player
})

const setMenu = newMenu => {
  menu.value = newMenu
} 

const getTopAiring = () => {
  loading.value =  true

  AnimeService.getTopAiring()
    .then((response) => {
      topAiringList.value = response.data.results
    }) 
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
      loading.value = false
    })
}

const search = (query) => {
  if (query == '') return

  menu.value = 'search'
  loading.value = true
  searchList.value = []

  AnimeService.search(query)
    .then((response) => {
      searchList.value = response.data.results
    }) 
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
      loading.value = false
    })
}

const getAnimeInfo = (id) => {
  menu.value = 'info'
  loading.value = true
  animeInfo.value = null

  AnimeService.getAnimeInfo(id)
    .then((response) => {
      animeInfo.value = response.data
    }) 
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
      loading.value = false
    })
}

const getWatchlist = () => {
  watchList.value = []
  const watchlistStr = localStorage.getItem('watchlist')

  if (watchlistStr != null) {
    watchList.value = JSON.parse(watchlistStr)
  }
}

const isInWatchlist = (id) => {
  if (id == null) return false

  const index = watchList.value.findIndex(item => {
    return item.id == id
  })

  return index > -1
}

const getSources = (episodeId, animeId) => {
  // Check if anime in watchlist
  const index = watchList.value.findIndex(item => {
    return item.id == animeId
  })

  // Update last episode in watchlist if exist
  if (index > -1) {
    watchList.value[index].lastEpisodeId = episodeId
    localStorage.setItem('watchlist', JSON.stringify(watchList.value))
  }

  sources.value = []
  sourceSet.value = false
  plyrCurrentTime.value =  0

  AnimeService.getStreamLink(episodeId)
    .then((response) => {
      sources.value = response.data.sources.filter((source) => {
        return source.quality != 'backup' && source.quality != 'default'
      })
    }) 
    .catch((error) => {
      console.log(error)
    })
}

const setHlsSource = (source) => {
  if (Hls.isSupported()) {
    sourceSet.value = false

    hls.destroy()
    hls = new Hls()
    hls.loadSource(`https://anime.sahabatgemarikan.id/cors/${source}`)
    hls.attachMedia(plyrPlayer.value.media)
    window.hls = hls
  }
}

const getCurrentYear = () => {
  return new Date().getFullYear()
}

const toggleTheme = () => {
  if (darkTheme.value) {
    document.documentElement.className = ''
  } else {
    document.documentElement.className = 'dark'
  }

  darkTheme.value = !darkTheme.value
  localStorage.setItem('darkTheme', darkTheme.value)
}

const getLastEpisodeId = (animeId) => {
  if (animeId == null) return null

  const filtered = watchList.value.filter(item => {
    return item.id == animeId
  })

  return (filtered.length > 0) ? filtered[0].lastEpisodeId : null
}

const toggleWatchlist = (id, title, image) => {
  // Check if anime in watchlist
  const index = watchList.value.findIndex(item => {
    return item.id == id
  })

  // Remove if exist, else add
  if (index > -1) {
    watchList.value.splice(index, 1)
  } else {
    watchList.value.push({ id, title, image, lastEpisodeId: null })
  }

  // Update localStorage
  localStorage.setItem('watchlist', JSON.stringify(watchList.value))
}

onMounted(() => {
  window.addEventListener( 'load', () => {
    windowLoaded.value = true
    getTopAiring()
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

  darkTheme.value = JSON.parse(localStorage.getItem('darkTheme')) === true
  if (darkTheme.value) document.documentElement.className = 'dark'
})
</script>

<template>
  <div class="mx-auto max-w-md bg-white dark:bg-gray-900">
    <Preloader :active="!windowLoaded" />
    
    <VideoSection ref="plyrParent"
      :active="menu == 'info'" :sourceSet="sourceSet"
      :plyrOptions="plyrOptions" />

    <MenuSection :darkTheme="darkTheme"
      @changeMenu="(newMenu) => setMenu(newMenu)"
      @search="(query) => search(query)"
      @changeTheme="toggleTheme()" />

    <TopAiringSection v-if="menu == 'home'"
      :topAiringList="topAiringList" :loading="loading"
      @selectAnime="(id) => getAnimeInfo(id)" />

    <SearchSection v-if="menu == 'search'"
      :searchList="searchList" :loading="loading"
      @selectAnime="(id) => getAnimeInfo(id)" />

    <AnimeInfoSection v-if="menu == 'info'"
      :animeInfo="animeInfo" :sources="sources" :loading="loading"
      :inWatchlist="isInWatchlist(animeInfoId)"
      :lastEpisodeId="getLastEpisodeId(animeInfoId)"
      @changeEpisode="({ episodeId, animeId }) => getSources(episodeId, animeId)"
      @changeQuality="(url) => setHlsSource(url)"
      @toggleWatchlist="({ id, title, image }) => toggleWatchlist(id, title, image)" />

    <WatchlistSection v-if="menu == 'watchlist'"
      :watchList="watchList" :loading="loading"
      @selectAnime="(id) => getAnimeInfo(id)"
      @clickDelete="(id) => toggleWatchlist(id, '', '')" />
    
    <div class="p-2 text-sm text-center text-gray-800 dark:text-white">
      <p>{{ `&copy; ${getCurrentYear()} ウィブ` }}</p>
    </div>
  </div>
</template>
