<script setup>
import { ref } from 'vue'
import { HomeIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import AButton from './AButton.vue'

defineEmits(['changeMenu', 'search'])

const searchText = ref('')
</script>

<template>
  <div class="flex gap-2 p-2">
    <div class="">
      <AButton @click="$emit('changeMenu', 'home')"
        class="h-10 w-10">
        <HomeIcon class="w-6 h-6" />
      </AButton>
    </div>

    <div class="grow">
      <form @submit.prevent="$emit('search', searchText)"
        class="relative">
        <input type="text" placeholder="Search anime..." v-model="searchText"
          class="block w-full h-10 rounded-full border-gray-300 shadow-sm text-sm
          focus:border-blue-300 focus:ring focus:ring-blue-200">
        <AButton @click="$emit('search', searchText)"
          class="absolute top-1/2 -translate-y-1/2 right-0 h-10 w-10">
          <MagnifyingGlassIcon class="w-6 h-6" />
        </AButton>
      </form>
    </div>
  </div>
</template>