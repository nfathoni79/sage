<script setup>
import { ref } from 'vue'
import VuePlyr from 'vue-plyr'
import Spinner from './Spinner.vue'

defineProps({
  active: Boolean,
  sourceSet: Boolean,
  plyrOptions: Object,
})

const plyr = ref(null)
defineExpose({ plyr })
</script>

<template>
  <div class="w-full aspect-video flex items-center justify-center
    bg-[url('/img/sage.png')] bg-cover bg-no-repeat">
    <Spinner v-if="active && !sourceSet" class="h-8 w-8 text-blue-600" />
    
    <div v-show="sourceSet">
      <VuePlyr ref="plyr" :options="plyrOptions">
        <video controls crossorigin playsinline data-poster="/img/sage.png">
        </video>
      </VuePlyr>
    </div>
  </div>
</template>

<style>
.plyr__progress__container {
  position: relative;
}

.plyr__progress__container .plyr__progress {
  position: absolute;
  top: -40px;
  left: -90px;
  width: calc(100% + 260px);
}

.plyr__volume {
  width: 100px
}
</style>