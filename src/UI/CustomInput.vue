<script setup lang="ts">
import {useField} from 'vee-validate'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: false,
    default: 'text'
  },
  placeholder: {
    type: String,
    required: false,
    default: ''
  },
  label: {
    type: String,
    required: false,
    default: ''
  },
  modelValue: {
    type: String,
    required: false
  }
})

const {value, errorMessage} = useField(() => props.name, undefined, {
  syncVModel: true
})

</script>

<template>
  <div class="relative flex flex-col w-full">
    <label :for="name" v-if="!!label" class="text-sm ml-2 dark:text-white">{{ label }}</label>
    <input v-model="value" :type="type" :placeholder="placeholder" :id="name" :title="placeholder"
           class="bg-transparent h-full p-2 flex shrink-0 border rounded-lg text-md dark:text-white"
           :class="{ 'border-danger': !!errorMessage, 'border-gray': !errorMessage}"/>
    <p class="text-sm text-danger">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>

</style>