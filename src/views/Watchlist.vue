<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Cog6ToothIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon
} from '@heroicons/vue/24/outline'

import AnimeCard from '../components/AnimeCard.vue'
import AButton from '../components/AButton.vue'

import BackupService from '../services/BackupService'

const props = defineProps({
  watchlist: Array,
})

const emit = defineEmits(['removeWatchlist', 'updateWatchlist'])

const backupId = ref('')
const backupMessage = ref('')
const settingsOpen = ref(false)

/**
 * Backup button color based on backupId.
 */
const backupButtonColor = computed(() => {
  return backupId.value ? 'green' : 'disabled'
})

onMounted(() => {
  const id = localStorage.getItem('backupId')
  if (id) backupId.value = id
})

/**
 * Backup current Watchlist to cloud.
 */
const backupWatchlist = () => {
  backupMessage.value = 'Loading...'
  localStorage.setItem('backupId', backupId.value)

  BackupService.updateData(backupId.value, props.watchlist)
    .then(response => {
      backupMessage.value = ''
    })
    .catch(error => {
      if (error.response?.status == 404) {
        backupMessage.value = 'Backup not found'
        return
      }

      backupMessage.value = error.message
    })
}

/**
 * Restore Watchlist from cloud backup.
 */
const restoreWatchlist = () => {
  backupMessage.value = 'Loading...'
  localStorage.setItem('backupId', backupId.value)

  BackupService.getData(backupId.value)
    .then(response => {
      const data = response.data
      
      if (!Array.isArray(data)) {
        backupMessage.value = 'Invalid data'
        return
      }

      if (data.length > 0 && (!data[0].id || !data[0].title || !data[0].image)) {
        backupMessage.value = 'Array Invalid data'
        return
      }

      backupMessage.value = ''
      emit('updateWatchlist', data)
    })
    .catch(error => {
      if (error.response?.status == 404) {
        backupMessage.value = 'Backup not found'
        return
      }

      backupMessage.value = error.message
    })
}

/**
 * Remove an anime from Watchlist.
 * @param {String} id - Anime ID. 
 */
const removeWatchlist = (id) => {
  emit('removeWatchlist', id)
}

/**
 * Show/hide settings.
 */
const toggleSettings = () => {
  settingsOpen.value = !settingsOpen.value
}
</script>

<template>
  <div class="p-2">
    <h1 class="text-xl font-semibold
      text-gray-800 dark:text-white text-center">
      Watchlist
    </h1>

    <div class="mt-4 mx-auto max-w-md text-center">
      <AButton type="button" color="blue"
        @click="toggleSettings()"
        class="px-4 py-2">
        <Cog6ToothIcon class="w-6 h-6" />
        <span class="ml-2">
          {{ settingsOpen ? 'Hide Settings' : 'Show Settings' }}
        </span>
      </AButton>

      <div v-if="settingsOpen" class="mt-2">
        <form @submit.prevent="" class="flex flex-col gap-2">
          <label class="flex items-center justify-center gap-2">
            <span class="text-gray-800 dark:text-white">Backup ID</span>
            <input type="text" v-model="backupId"
              placeholder="Enter 19-digit unique number" required
              class="grow h-10 rounded-full shadow-sm
              border-gray-300 dark:border-gray-600
              bg-gray-50 dark:bg-gray-700
              text-gray-800 dark:text-white dark:placeholder-gray-400 text-sm
              focus:outline-none focus:border-blue-300 dark:focus:border-blue-500
              focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500">
          </label>
          
          <div class="flex items-center justify-center gap-2">
            <AButton type="submit" :color="backupButtonColor"
              :disabled="!backupId" @click="backupWatchlist()"
              class="px-4 py-2">
              <ArrowUpTrayIcon class="w-6 h-6" />
              <span class="ml-2">Backup</span>
            </AButton>

            <AButton type="submit" :color="backupButtonColor"
              :disabled="!backupId" @click="restoreWatchlist()"
              class="px-4 py-2">
              <ArrowDownTrayIcon class="w-6 h-6" />
              <span class="ml-2">Restore</span>
            </AButton>
          </div>
        </form>

        <p v-if="backupMessage"
          class="mt-2 text-gray-800 dark:text-white">
          {{ backupMessage }}
        </p>
      </div>
    </div>

    <p v-if="watchlist.length <= 0"
      class="mt-4 text-gray-800 dark:text-white text-center">
      No anime to watch yet.
    </p>

    <div v-else>
      <!-- Cards -->
      <div class="mt-4 grid grid-cols-2 sm:grid-cols-3
        md:grid-cols-4 lg:grid-cols-5 gap-2">
        <AnimeCard v-for="item in watchlist" :key="item.id"
          :id="item.id" :title="item.title"
          :image="item.image" :genres="[]" :deleteBtn="settingsOpen"
          @click="$router.push({ name: 'anime', params: { id: item.id } })"
          @clickDelete="removeWatchlist(item.id)" />
      </div>
    </div>
  </div>
</template>