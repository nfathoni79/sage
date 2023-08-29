<script setup>
import { ref, onMounted } from 'vue'
import {
  HomeIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  BookmarkSquareIcon
} from '@heroicons/vue/24/outline'
import AButton from './AButton.vue'

defineEmits(['changeTheme'])

const darkTheme = ref(false)
const searchText = ref('')

onMounted(() => {
  darkTheme.value = JSON.parse(localStorage.getItem('darkTheme')) === true
  if (darkTheme.value) document.documentElement.className = 'dark'
})

/**
 * Toggle theme to light or dark.
 */
const toggleTheme = () => {
  if (darkTheme.value) {
    document.documentElement.className = ''
  } else {
    document.documentElement.className = 'dark'
  }

  darkTheme.value = !darkTheme.value
  localStorage.setItem('darkTheme', darkTheme.value)
}
</script>

<template>
  <div class="mx-auto max-w-md flex gap-2 p-2">
    <AButton @click="$router.push({ name: 'home' })"
      class="h-10 w-10">
      <HomeIcon class="w-6 h-6" />
    </AButton>

    <div class="grow">
      <form @submit.prevent="$router.push({ name: 'search', query: { q: searchText } })"
        class="relative">
        <input type="text" v-model="searchText"
          placeholder="Search anime..." required
          class="block w-full h-10 rounded-full shadow-sm
          border-gray-300 dark:border-gray-600
          bg-gray-50 dark:bg-gray-700
          text-gray-800 dark:text-white dark:placeholder-gray-400 text-sm
          focus:outline-none focus:border-blue-300 dark:focus:border-blue-500
          focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500">
        <AButton type="submit"
          @click="$router.push({ name: 'search', query: { q: searchText } })"
          class="absolute top-1/2 -translate-y-1/2 right-0 h-10 w-10">
          <MagnifyingGlassIcon class="w-6 h-6" />
        </AButton>
      </form>
    </div>

    <AButton
      @click="$router.push({ name: 'watchlist' })" class="h-10 w-10">
      <BookmarkSquareIcon class="w-6 h-6" />
    </AButton>

    <AButton :color="darkTheme ? 'orange' : 'black'"
      @click="toggleTheme()" class="h-10 w-10">
      <component :is="darkTheme ? SunIcon : MoonIcon" class="w-6 h-6" />
    </AButton>
  </div>
</template>