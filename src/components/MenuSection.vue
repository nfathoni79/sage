<script setup>
import { ref } from 'vue'
import {
  HomeIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  BookmarkSquareIcon
} from '@heroicons/vue/24/outline'
import AButton from './AButton.vue'

defineProps({
  darkTheme: Boolean,
})

defineEmits(['changeMenu', 'search', 'changeTheme'])

const searchText = ref('')
</script>

<template>
  <div class="flex gap-2 p-2">
    <AButton @click="$emit('changeMenu', 'home')"
      class="h-10 w-10">
      <HomeIcon class="w-6 h-6" />
    </AButton>

    <div class="grow">
      <form @submit.prevent="$emit('search', searchText)"
        class="relative">
        <input type="text" v-model="searchText"
          placeholder="Search anime..." required
          class="block w-full h-10 rounded-full shadow-sm
          border-gray-300 dark:border-gray-600
          bg-gray-50 dark:bg-gray-700
          text-gray-800 dark:text-white dark:placeholder-gray-400 text-sm
          focus:outline-none focus:border-blue-300 dark:focus:border-blue-500
          focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500">
        <AButton type="submit" @click="$emit('search', searchText)"
          class="absolute top-1/2 -translate-y-1/2 right-0 h-10 w-10">
          <MagnifyingGlassIcon class="w-6 h-6" />
        </AButton>
      </form>
    </div>

    <AButton
      @click="$emit('changeMenu', 'watchlist')" class="h-10 w-10">
      <BookmarkSquareIcon class="w-6 h-6" />
    </AButton>

    <AButton :color="darkTheme ? 'orange' : 'black'"
      @click="$emit('changeTheme')" class="h-10 w-10">
      <component :is="darkTheme ? SunIcon : MoonIcon" class="w-6 h-6" />
    </AButton>
  </div>
</template>