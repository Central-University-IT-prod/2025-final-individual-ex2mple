<script setup lang="ts">
import {Icon} from '@iconify/vue'
import {computed, inject, onMounted, type Ref, ref} from 'vue'
import CustomInput from '@/UI/CustomInput.vue'
import Button from '@/UI/Button.vue'
import DBHelper from "@/helpers/dbHelper.ts";
import type {Exercise, ProgramExercise} from "@/types.ts";
import router from "@/router";
import {filterItems} from "@/helpers/filterHelper.ts";
import {exportConfig} from "@/helpers/exportConfig.ts";
import {importConfig} from "@/helpers/importConfig.ts";
import {genTags} from "@/helpers/otherMethods.ts";
import FilterModal from "@/components/filterModal.vue";

const searchOpen = ref(false)
const filterOpen = ref(false)
const exercises = ref<Exercise[]>([])
const sortCriteria = ref({name: '', difficulty: [''], equipment: [''], muscleGroup: [''], type: ['']});
const props = defineProps({
  chooseExercise: {
    type: Boolean,
    required: false,
    default: false
  }
})
let localHistory: Ref = ref()
let exercise: Ref = ref()
if (props.chooseExercise) {
  localHistory = inject<Ref>('localHistory')!
  exercise = inject<Ref>('exercise')!
}

onMounted(() => {
  const db = new DBHelper<Exercise>('exercises')
  db.getAllItems().then((data) => exercises.value = data)
})


const openExercise = (newExercise: Exercise) => {
  if (props.chooseExercise) {
    localHistory!.value.push(2)
    exercise!.value = {exercise: newExercise, goal: 0, goalType: ''} as ProgramExercise
  } else {
    router.push(`/exercise?id=${newExercise.id}`)
  }
}

const filteredExercises = computed((): Exercise[] => {
  return (filterItems(exercises.value, sortCriteria.value) as Exercise[])
})



</script>

<template>
  <main class="relative flex flex-1 flex-col w-full max-w-[1440px] mx-auto gap-4 dark:text-white">
    <section
        class="inline-flex sticky top-0 h-10 items-center text-xl font-semibold gap-2 dark:text-neo-green dark:bg-black bg-white">
      <div class="inline-flex gap-2" v-if="!searchOpen">
        <Icon icon="material-symbols:keyboard-backspace-rounded" class="text-2xl left-0 cursor-pointer"
              @click="chooseExercise ? localHistory.pop(localHistory.length - 1) : router.go(-1)" v-if="chooseExercise"/>
        <span class="">Упражнения</span>
        <Icon icon="material-symbols:search-rounded" class="text-2xl hover:cursor-pointer" @click="searchOpen = true"/>
        <div class="relative flex gap-2" v-if="!chooseExercise">
          <router-link to="/exercise" title="Создать упражнение">
            <Icon icon="material-symbols:add-2-rounded" class="text-2xl hover:cursor-pointer"/>
          </router-link>
          <Icon icon="material-symbols:upload-rounded" class="text-2xl hover:cursor-pointer"
                @click="exportConfig('exercises')"/>
          <div class="relative">
            <Icon icon="material-symbols:download-rounded" class="text-2xl"/>
            <input type="file" title="Импортировать упражнения" accept="application/json" @change="(event) => importConfig(event, 'exercises')"
                   class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
          </div>
        </div>
      </div>
      <div class="inline-flex gap-2 items-center" v-else>
        <CustomInput name="title" placeholder="Название" class="max-w-[300px] h-8 text-base"
                     v-model="sortCriteria.name"></CustomInput>
        <Icon icon="material-symbols:cancel-rounded" class="text-2xl hover:cursor-pointer"
              @click="() => {searchOpen = false; sortCriteria.name = ''}"/>
      </div>

    </section>
    <section class="flex flex-col flex-1 gap-4">
      <div class="flex w-full shrink-0 h-20 gap-4 cursor-pointer" v-for="exercise in filteredExercises"
           @click="openExercise(exercise)">
        <div class="w-20">
          <img :src="exercise.images[0]" v-if="exercise.images"
               class="rounded-full object-cover w-full h-full select-none" alt="Exercise image">
        </div>
        <div class="flex flex-col flex-1">
          <span class="flex-1 text-sm line-clamp-2">{{ exercise.name }}</span>
          <span class="flex-1 text-gray line-clamp-2 text-sm">{{ genTags(exercise) }}</span>
        </div>
      </div>
    </section>
    <Button class="sticky flex items-center md:top-20
            justify-center bottom-20 mt-auto ml-auto text-xl bg-neo-green text-black w-12 h-12 z-10"
            title="Фильтры" @click="filterOpen = true">
      <Icon icon="material-symbols:filter-alt" class="text-2xl"/>
    </Button>
    <FilterModal v-model:tags="sortCriteria" v-model:open="filterOpen"></FilterModal>
  </main>
</template>

<style scoped>

</style>