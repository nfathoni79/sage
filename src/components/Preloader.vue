<script setup>
import Spinner from './Spinner.vue'

defineProps({
  active: Boolean,
})
</script>

<template>
  <transition leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div v-if="active" class="fixed z-20 inset-0
        flex flex-col items-center justify-center bg-blue-200">
      <Spinner class="h-20 w-80 text-blue-600" />
      <p class="mt-4 text-center text-xl font-semibold text-blue-600">
        Take your time
      </p>
    </div>
  </transition>
</template>