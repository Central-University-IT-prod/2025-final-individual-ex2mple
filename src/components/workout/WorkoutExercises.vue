<script setup lang="ts">

import {genTags} from "@/helpers/otherMethods.ts";
import type {ProgramExercise, Workout} from "@/types.ts";
import type {PropType} from "vue";
import Timer from "@/UI/Timer.vue";
import Button from "@/UI/Button.vue";
import DBHelper from "@/helpers/dbHelper.ts";


const props = defineProps({
  exercise: {
    required: true,
    type: Object as PropType<ProgramExercise>
  },
  index: {
    type: Number,
    required: true
  },
  isStarted: {
    required: true,
    type: Boolean
  }
})

const currentExerciseIndex = defineModel<number>('current', {required: true})

const skipExercise = () => {
  const workoutDB = new DBHelper<Workout>('workouts')
  workoutDB.getLastItem().then(workout => {
    workout!.skipped++
    currentExerciseIndex.value++
    workoutDB.updateItem(workout!)
  })
}

const finishExercise = () => {
  const workoutDB = new DBHelper<Workout>('workouts')
  workoutDB.getLastItem().then(workout => {
    workout!.finished++
    if (props.exercise.goalType !== 'Повторения') {
      workout!.reps += props.exercise.goal
    }
    currentExerciseIndex.value++;
    workoutDB.updateItem(workout!)
  })
}

</script>

<template>
  <section class="flex flex-col gap-2">
    <div class="flex w-full shrink-0 h-20 gap-4" @click="">
      <div class="w-20">
        <img :src="exercise.exercise.images[0]" v-if="exercise.exercise.images"
             class="rounded-full object-cover w-full h-full select-none" alt="Exercise image">
      </div>
      <div class="flex flex-col flex-1">
        <span class="flex-1 text-sm line-clamp-2">{{ exercise.exercise.name }}</span>
        <span class="flex-1 text-gray line-clamp-2 text-sm">{{ genTags(exercise.exercise) }}</span>
      </div>
    </div>
    <div class="flex flex-col gap-2" v-if="isStarted && currentExerciseIndex === index">
      <Timer v-if="exercise.goalType === 'Время'" :target="exercise.goal" v-model:current="currentExerciseIndex"
             @finish-exercise="finishExercise"></Timer>
      <div class="block">
        <p>Тип цели: <span class="text-xl dark:text-neo-green">{{ exercise.goalType }}</span></p>
        <p>Цель: <span class="text-xl dark:text-neo-green">{{ exercise.goal }}</span></p>
      </div>
      <div class="flex gap-4">
        <Button class="border border-danger flex-1" type="button" @click="skipExercise">Пропустить</Button>
        <Button class="bg-neo-green flex-1 text-black" type="button" @click="finishExercise"
                v-if="exercise.goalType !== 'Время'">
          Завершить
        </Button>
      </div>
    </div>
  </section>

</template>

<style scoped>

</style>