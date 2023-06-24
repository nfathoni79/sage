<script setup>
import { ref } from 'vue'
import { PauseIcon, BackwardIcon, ForwardIcon } from '@heroicons/vue/24/solid'
import VuePlyr from 'vue-plyr'
import Spinner from './Spinner.vue'
import AButton from './AButton.vue'

defineProps({
  active: Boolean,
  sourceSet: Boolean,
  plyrOptions: Object,
  showControls: Boolean,
  playing: Boolean,
})

defineEmits(['rewind', 'forward', 'pause'])

const plyr = ref(null)
defineExpose({ plyr })
</script>

<template>
  <div class="w-full aspect-video flex items-center justify-center
    bg-[url('/img/sage.png')] bg-cover bg-no-repeat">
    <Spinner v-if="active && !sourceSet" class="h-8 w-8 text-blue-600" />
    
    <div id="custom-control-wrapper" v-show="sourceSet" class="relative">
      <div v-show="showControls"
        class="absolute w-full h-full flex items-center justify-evenly">
        <AButton color="cyan" @click="$emit('rewind')" class="z-10">
          <BackwardIcon class="w-6 h-6" />
        </AButton>
        <AButton color="cyan" @click="$emit('pause')"
          :class="playing ? 'z-10' : '-z-10'">
          <PauseIcon class="w-8 h-8" />
        </AButton>
        <AButton color="cyan" @click="$emit('forward')" class="z-10">
          <ForwardIcon class="w-6 h-6" />
        </AButton>
      </div>
      
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