<script setup>
const props = defineProps({
  modelValue: [String, Number],
  group: String,
  options: Array,
})

defineEmits(['update:modelValue'])

const getId = (position) => {
  return `${props.group}-${props.options[position]}`
}
</script>

<template>
  <div>
    <div v-for="(option, index) in options" :key="index"
      class="inline-block space-x-1 space-y-1">
      
      <input type="radio" :name="group" :value="option" :id="getId(index)"
        @change="$emit('update:modelValue', option)"
        :checked="option === modelValue"
        class="sr-only peer">
      
        <label :for="getId(index)"
          class="flex items-center justify-center
          bg-white hover:bg-gray-50 border border-gray-300 rounded-full
          px-2 py-1 text-gray-800 cursor-pointer focus:outline-none
          peer-checked:ring-blue-500 peer-checked:ring-2
          peer-checked:border-transparent">
          {{ option }}
        </label>
    </div>
  </div>
</template>