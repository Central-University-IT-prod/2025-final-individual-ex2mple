<script setup lang="ts">
import Programs from "@/components/workout/Programs.vue";
import {provide, ref} from "vue";
import WorkoutProgram from "@/components/workout/WorkoutProgram.vue";
import type {Program, User, Workout} from "@/types.ts";
import {Icon} from "@iconify/vue";
import DBHelper from "@/helpers/dbHelper.ts";
import {useRoute} from "vue-router";
import Button from "@/UI/Button.vue";
import {getTimeDelta} from "@/helpers/otherMethods.ts";
import Modal from "@/UI/Modal.vue";
import router from "@/router";

const route = useRoute();
const oneTimeProgram = !!route.query.oneTimeProgram;

const history = ref([0])
const program = ref<Program | undefined>(undefined)
const isStarted = ref(false)
const showStats = ref(false)
const finishWorkoutData = ref<Workout>()

if (oneTimeProgram) {
  history.value = [1]
  const db = new DBHelper<Program>('programs');
  db.getLastItem().then((data) => {
    program.value = data!
    db.deleteItem(data!.id!)
  })
}
provide('history', history)

const startWorkout = () => {
  const workoutDB = new DBHelper<Workout>('workouts')
  workoutDB.addItem({
    name: program.value?.name!,
    skipped: 0,
    finished: 0,
    duration: 0,
    reps: 0,
    date: new Date(),
  }).then(() => {
    isStarted.value = true
    const header = document.querySelector('header')!
    header.classList.add('hidden')
  })
}

const finishWorkout = () => {
  const workoutDB = new DBHelper<Workout>('workouts')
  workoutDB.getLastItem().then((workout) => {
    workout!.duration = new Date().getTime() - workout!.date.getTime()
    finishWorkoutData.value = workout!
    showStats.value = true
    workoutDB.updateItem(workout!)
    const header = document.querySelector('header')!
    header.classList.remove('hidden')
    const characterDB = new DBHelper<User>('users')
    characterDB.getLastItem().then((user) => {
      user!.coins += 10
      characterDB.updateItem(user!)
    })
  })
}

const closeStats = () => {
  showStats.value = false
  router.push({ path: `/main` })
}

</script>

<template>
  <main class="relative flex flex-1 flex-col w-full max-w-[1440px] items-center mx-auto gap-4 py-2 dark:text-white">
    <h1 class="inline-flex items-center text-2xl font-medium dark:text-neo-green mt-2" v-if="!isStarted">
      <Icon icon="material-symbols:keyboard-backspace-rounded" class="absolute text-2xl left-0 cursor-pointer"
            @click="history.pop()" v-show="history[history.length - 1] !== 0 && !oneTimeProgram"/>
      Выбор программы
    </h1>
    <Programs v-if="history[history.length - 1] === 0" v-model:program="program"></Programs>
    <WorkoutProgram v-else-if="history[history.length - 1] === 1" :program="program" :isStarted="isStarted"
                    @finish-workout="finishWorkout"></WorkoutProgram>
    <Button class="bg-neo-green text-black" type="button" v-if="history[history.length - 1] !== 0 && !isStarted" @click="startWorkout">
      Начать
    </Button>
    <Button class="border border-danger mt-auto" type="button" v-if="program && isStarted" @click="finishWorkout">
      Завершить
    </Button>
    <modal :self-closeable="true" :show="showStats" @self-close-modal="closeStats">
      <template #header>Статистика по тренировке</template>
      <template #body>
        <div class="flex flex-col gap-2">
          <p class="flex flex-col">
            Продолжительность:
            <span class="text-2xl text-neo-green">{{getTimeDelta(finishWorkoutData!.duration)}}</span>
          </p>
          <p class="flex flex-col">
            Завершенных упр.:
            <span class="text-2xl text-neo-green">{{finishWorkoutData!.finished}}</span>
          </p>
          <p class="flex flex-col">
            Пропущенных упр.:
            <span class="text-2xl text-neo-green">{{finishWorkoutData!.skipped}}</span>
          </p>
          <p class="flex flex-col">
            Повторений:
            <span class="text-2xl text-neo-green">{{finishWorkoutData!.reps}}</span>
          </p>
        </div>
      </template>
    </modal>
  </main>
</template>

<style scoped>

</style>