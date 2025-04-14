<script setup lang="ts">
import {Calendar as VCalendar} from 'v-calendar'
import {useScreens} from 'vue-screen-utils';
import {ref} from 'vue'
import DBHelper from "@/helpers/dbHelper.ts";
import type {Workout} from "@/types.ts";
import {getTimeDelta} from "../helpers/otherMethods.ts";

const {mapCurrent} = useScreens({
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
});
const columns = mapCurrent({md: 2, lg: 3}, 1);


const attrs = ref([
  {
    key: 'today',
    highlight: {
      color: 'blue',
      fillMode: 'light',
    },
    dates: new Date(),
  }
]);

const getAllTrainingsData = () => {
  const workoutDB = new DBHelper<Workout>('workouts')
  workoutDB.getAllItems().then(workoutsData => {
    workoutsData.forEach((workout) => {
      attrs.value.push({
        dates: new Date(workout.date),
        content: 'blue',
        popover: true,
        customData: workout
      })
    })
  })
}

getAllTrainingsData()
</script>

<template>
  <VCalendar transparent :columns="columns" :expanded="true" :attributes="attrs"
             :is-dark="{ selector: ':root', darkClass: 'dark' }">
    <template #day-popover="{attributes}">
      <section class="flex flex-col max-w-[150px] max-h-[300px] overflow-auto divide-y divide-gray">
        <div class="flex flex-col text-xs gap-2 py-2" v-for="{key, customData} in attributes" :key="key">
          <span class="">Тренировка: <span class="font-semibold dark:text-neo-green">{{ customData.name }}</span></span>
          <span class="inline-flex items-center">Время:
            <span
                class="font-semibold ml-auto dark:text-neo-green">{{ getTimeDelta(customData.duration) }}
            </span>
          </span>
        </div>
      </section>
    </template>
  </VCalendar>
</template>

<style scoped>

</style>