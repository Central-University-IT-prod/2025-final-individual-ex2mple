<script setup lang="ts">

import WorkoutExercise from "@/components/workout/WorkoutExercises.vue";
import type {Program} from "@/types.ts";
import {type PropType, ref, watch} from "vue";
import Timer from "@/UI/Timer.vue";

const emit = defineEmits(['finishWorkout'])

const props = defineProps({
  program: {
    type: Object as PropType<Program | undefined>,
    required: true
  },
  isStarted: {
    type: Boolean,
    required: true,
  }
})

const currentExerciseId = ref<number>(0)

watch(() => currentExerciseId.value, () => {
  if (currentExerciseId.value === props.program!.exercises.length) {
    emit('finishWorkout')
  }
})

</script>

<template>
  <section class="flex flex-col gap-4 max-w-screen-md w-full">
    <span class="dark:text-neo-green text-2xl">{{ program?.name }}</span>
    <span class="text-gray text-base">{{ program?.description }} <Timer v-if="isStarted"></Timer></span>
    <section class="flex flex-col flex-1 gap-4">
      <WorkoutExercise :exercise="exercise" :isStarted="isStarted" :index="index"
                       v-for="(exercise, index) in program?.exercises"
                       v-model:current="currentExerciseId">
      </WorkoutExercise>
    </section>
  </section>

</template>

<style scoped>

</style>