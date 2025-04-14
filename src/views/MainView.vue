<script setup lang="ts">
import Calendar from '@/components/Calendar.vue'
import Button from '@/UI/Button.vue'
import {Icon} from '@iconify/vue'
import router from "@/router";
import {getTimeDelta} from "@/helpers/otherMethods.ts";
import type {Workout} from "@/types.ts";
import {ref} from "vue";
import DBHelper from "@/helpers/dbHelper.ts";

const lastSevenWorkoutsInOne = ref<Workout>({} as Workout);

const newWorkout = () => {
  router.push({path: '/workout'})
}

const getLastSevenWorkouts = () => {
  const workoutDB = new DBHelper<Workout>('workouts')
  workoutDB.getAllItems().then(workouts => {
    const k = workouts.slice(-7)
    lastSevenWorkoutsInOne.value.duration = k.map((workout: Workout) => workout.duration).reduce((a, b) => a + b, 0);
    lastSevenWorkoutsInOne.value.finished = k.map((workout: Workout) => workout.finished).reduce((a, b) => a + b, 0);
    lastSevenWorkoutsInOne.value.skipped = k.map((workout: Workout) => workout.skipped).reduce((a, b) => a + b, 0);
    lastSevenWorkoutsInOne.value.reps = k.map((workout: Workout) => workout.reps).reduce((a, b) => a + b, 0);
  })
}

getLastSevenWorkouts()

</script>

<template>
  <main class="relative flex flex-1 w-full flex-col max-w-[1440px] mx-auto pt-4 gap-4 dark:text-white">
    <h1 class="text-3xl dark:text-neo-green font-semibold mx-auto">Главная</h1>
    <Calendar></Calendar>
    <div class="flex flex-col gap-2">
      <span class="text-lg font-semibold dark:text-neo-green">Статистика за 7 тренировок:</span>
      <p class="flex flex-col">
        Общая продолжительность:
        <span class="text-2xl dark:text-neo-green">{{ getTimeDelta(lastSevenWorkoutsInOne?.duration) }}</span>
      </p>
      <p class="flex flex-col">
        Завершенных упр.:
        <span class="text-2xl dark:text-neo-green">{{ lastSevenWorkoutsInOne?.finished }}</span>
      </p>
      <p class="flex flex-col">
        Пропущенных упр.:
        <span class="text-2xl dark:text-neo-green">{{ lastSevenWorkoutsInOne?.skipped }}</span>
      </p>
      <p class="flex flex-col">
        Повторений:
        <span class="text-2xl dark:text-neo-green">{{ lastSevenWorkoutsInOne?.reps }}</span>
      </p>
    </div>
    <Button
        class="sticky bottom-20 flex items-center justify-center mt-auto ml-auto text-xl bg-neo-green text-black w-12 h-12 z-10"
        title="Добавить тренировку" @click="newWorkout">
      <Icon icon="material-symbols:add-2-rounded" class="text-2xl"/>
    </Button>
  </main>
</template>

<style scoped>

</style>