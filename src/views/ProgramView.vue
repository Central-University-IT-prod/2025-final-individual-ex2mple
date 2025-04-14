<script setup lang="ts">

import router from "@/router";
import {Icon} from "@iconify/vue";
import Button from "@/UI/Button.vue";
import CustomInput from "@/UI/CustomInput.vue";
import {useForm} from "vee-validate";
import {provide, ref, toRaw, watch} from "vue";
import type {Exercise, Program, ProgramExercise} from "@/types.ts";
import * as yup from "yup";
import {useRoute} from "vue-router";
import DBHelper from "@/helpers/dbHelper.ts";
import {genTags} from "../helpers/otherMethods.ts";
import CatalogView from "@/views/CatalogView.vue";
import ProgramExerciseComponent from "@/components/ProgramExercise.vue";
import ProgramView from "@/views/ProgramView.vue";
import Toggle from "@/UI/Toggle.vue";
import FilterModal from "@/components/filterModal.vue";
import {autoSelectExercises} from "@/helpers/autoSelectExercises.ts";

const route = useRoute();
const id = Number(route.query.id) || null;
const editing = ref<boolean>(!id)
const cachedValues = ref()
const exercises = ref<ProgramExercise[]>([])
const localHistory = ref([0])
const exercise = ref()
const editExercise = ref(false)
const isAutoSelect = ref(false)
const openFilter = ref(false)

const tags = ref({difficulty: [''], equipment: [''], muscleGroup: [''], type: ['']});

provide('localHistory', localHistory)
provide('exercise', exercise)
provide('exercises', exercises)
provide('editExercise', editExercise)


const {handleSubmit, setValues} = useForm<Program>({
  validationSchema: yup.object({
    name: yup.string().required('Это обязательное поле'),
  })
})

if (id) {
  const exerciseDB = new DBHelper<Program>('programs')
  exerciseDB.getItem(id).then((program) => {
    setValues(program!)
    cachedValues.value = program!
    exercises.value = program!.exercises
  })
}

const toggleEditing = () => {
  setValues(cachedValues.value)
  editing.value = !editing.value;
}

const removeProgram = () => {
  if (confirm('Вы точно хотите удалить программу?')) {
    const exerciseDB = new DBHelper<Program>('programs')
    exerciseDB.deleteItem(id!).then(() => router.go(-1))
  }
}

const onSubmit = handleSubmit((values) => {
  const exerciseDB = new DBHelper<Program>('programs')
  values.exercises = toRaw(exercises.value)
  exerciseDB.addItem(values as Omit<Program, "id">).then(() => router.push('/programs'))
})

const onSave = handleSubmit((values) => {
  const exerciseDB = new DBHelper<Program>('programs')
  values.exercises = toRaw(exercises.value)
  exerciseDB.updateItem(values as Omit<Program, "id">).then(() => router.go(-1))
})

const openExercise = (newExercise: ProgramExercise) => {
  editExercise.value = editing.value
  exercise.value = newExercise
  localHistory.value.push(2)
}

watch(() => openFilter.value, () => {
      const db = new DBHelper<Exercise>('exercises')
      db.getAllItems().then((allExercises) => {
        exercises.value = autoSelectExercises(tags.value, allExercises)
      })
    },
);

const oneTimeWorkout = handleSubmit((values) => {
  const exerciseDB = new DBHelper<Program>('programs')
  values.exercises = toRaw(exercises.value)
  exerciseDB.addItem(values as Omit<Program, "id">).then(() => {
    router.push('/workout?oneTimeProgram=1')
  })
})

</script>

<template>
  <main class="relative flex flex-1 flex-col w-full max-w-[1440px] items-center mx-auto gap-4 dark:text-white"
        v-show="localHistory[localHistory.length - 1] === 0">
    <section
        class="inline-flex sticky w-full max-w-screen-md justify-center top-0 h-10 z-10 items-center text-xl font-semibold gap-2 dark:text-neo-green dark:bg-black bg-white">
      <Icon icon="material-symbols:keyboard-backspace-rounded" class="absolute text-2xl left-0 cursor-pointer"
            @click="router.go(-1)"/>
      <span class="inline-flex items-center gap-2">
        Программа
        <Icon icon="material-symbols:edit-outline-rounded"
              class="cursor-pointer text-2xl"
              @click="toggleEditing" v-if="!editing && id"/>
        <Icon icon="material-symbols:edit-off-outline-rounded"
              class="cursor-pointer text-2xl"
              @click="toggleEditing" v-else-if="!!editing && id"/>
        <Icon icon="material-symbols:delete-rounded" class="text-2xl text-danger cursor-pointer"
              @click="removeProgram" v-if="!!id"/>
      </span>
    </section>
    <form class="flex flex-1 flex-col gap-4 max-w-screen-md w-full" @submit="onSubmit" aria-label="Форма создания программы">
      <CustomInput name="name" placeholder="Название*" v-if="editing" :is="ProgramView"></CustomInput>
      <span class="dark:text-neo-green text-2xl" v-else>{{ cachedValues?.name }}</span>
      <CustomInput name="description" placeholder="Описание" v-if="editing"></CustomInput>
      <span class="text-gray text-base" v-else>{{ cachedValues?.description }}</span>
      <section class="flex flex-col gap-4">
        <div class="flex w-full shrink-0 h-20 gap-4 cursor-pointer" v-for="exercise in exercises"
             @click="openExercise(exercise)">
          <div class="w-20">
            <img :src="exercise.exercise.images[0]" v-if="exercise.exercise.images"
                 class="rounded-full object-cover w-full h-full select-none" alt="Exercise image">
          </div>
          <div class="flex flex-col flex-1">
            <span class="flex-1 text-sm line-clamp-2">{{ exercise.exercise.name }}</span>
            <span class="flex-1 text-gray line-clamp-2 text-sm">{{ genTags(exercise.exercise) }}</span>
          </div>
        </div>
      </section>
      <div class="inline-flex items-center gap-2" v-if="!id">
        <span>Автоподбор</span>
        <toggle v-model="isAutoSelect" id="auto-select-toggle"></toggle>
      </div>
      <span v-if="isAutoSelect" class="text-warning text-sm">Внимание! Для автоматически подобранных упражнений нужно самостоятельно выбрать цель!</span>
      <Button class="text-sm border dark:border-neo-green border-gray" type="button" @click="openFilter = true"
              v-if="isAutoSelect">
        Выбрать теги для автоподбора
      </Button>
      <FilterModal v-model:tags="tags" v-model:open="openFilter"></FilterModal>
      <Button
          class="bg-neo-green text-black mb-auto" type="button"
          title="Добавить упражнение" @click="localHistory.push(1)" v-if="editing">
        Добавить упражнение
      </Button>
      <Button class="bg-neo-green text-black" type="submit" title="Добавить тренировку" v-if="!id">
        Добавить программу
      </Button>
      <Button class="bg-neo-green text-black" type="button" @click="onSave" v-else-if="!!id && editing">
        Сохранить
      </Button>
      <Button class="text-sm border dark:border-neo-green border-gray" type="button" @click="oneTimeWorkout" v-if="!id">
        Выполнить программу (без сохранения)
      </Button>
    </form>
  </main>
  <catalog-view v-show="localHistory[localHistory.length - 1] === 1" choose-exercise></catalog-view>
  <ProgramExerciseComponent v-if="localHistory[localHistory.length - 1] === 2"
                            :edit="editExercise"></ProgramExerciseComponent>
</template>

<style scoped>

</style>