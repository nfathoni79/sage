<script setup>
import { ref } from 'vue'
import Spinner from './Spinner.vue'

defineProps({
  url: String,
  name: String,
  className: String,
})

const loaded = ref(false)
</script>

<template>
  <div>
    <Spinner v-if="!loaded" class="h-8 w-8 text-blue-600" />

    <img v-show="loaded" @load="loaded = true"
      :src="url" :alt="name" :class="className" />
  </div>
</template>