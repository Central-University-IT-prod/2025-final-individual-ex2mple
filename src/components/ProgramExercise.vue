<script setup lang="ts">

import {Icon} from "@iconify/vue";
import type {ProgramExercise, User} from "@/types.ts";
import {computed, inject, ref, type Ref, toRaw} from "vue";
import {genTags} from "@/helpers/otherMethods.ts";
import Button from "@/UI/Button.vue";
import {goalType} from "@/constants.ts";
import {Field, useForm} from "vee-validate";
import * as yup from "yup";
import CustomInput from "@/UI/CustomInput.vue";
import {calculateGoal} from "@/helpers/calculateGoal.ts";
import DBHelper from "@/helpers/dbHelper.ts";

const localHistory = inject<Ref>('localHistory')
const exercise = inject<Ref<ProgramExercise>>('exercise')
const exercises = inject<Ref>('exercises')
const editExercise = inject<Ref>('editExercise')
const editing = ref(localHistory!.value[localHistory!.value.length - 2] === 1)
const userData = ref<User>({} as User)

const characterDB = new DBHelper<User>('users')
characterDB.getLastItem().then((item) => {
  userData.value = item!
})

const {handleSubmit, setValues, setFieldValue, values} = useForm<ProgramExercise>({
  validationSchema: yup.object({
    goalType: yup.string().required(),
    goal: yup.number().typeError('').required('Это обязательное поле').min(1, 'Минимум 1')
  })
})


const addExercise = handleSubmit((values) => {
  const data: ProgramExercise = {} as ProgramExercise;
  data.exercise = toRaw(exercise!.value.exercise)
  data.goal = values.goal
  data.goalType = values.goalType
  exercises!.value.push(data)
  localHistory!.value = [0]
})

const toggleEditing = () => {
  setValues(exercise!.value)
  editing.value = !editing.value;
}

const removeExercise = () => {
  const index = exercises!.value.findIndex((ex: ProgramExercise) => ex.exercise.id === exercise!.value.exercise.id);
  if (index !== -1) {
    exercises!.value.splice(index, 1);
    localHistory!.value = [0]
  }
};

const onChange = () => {
  const goal = calculateGoal(values.goalType, userData!.value?.weight, userData!.value?.height, userData!.value?.goal, exercise!.value?.exercise?.difficulty)
  setFieldValue('goal', goal)
}

const returnToBack = () => {
  localHistory!.value.pop(localHistory!.value.length - 1)
}

const warnings = computed(() => {
  let warningMessage: string
  if (values.goal > 50 + calculateGoal(values.goalType, userData!.value?.weight, userData!.value?.height, userData!.value?.goal, exercise!.value?.exercise?.difficulty)) {
    warningMessage = "⚠️ Слишком большая нагрузка! Будьте осторожны.";
  } else {
    warningMessage = ''
  }
  return warningMessage;
});

const saveExercise = () => {
  exercise!.value.goalType = values.goalType
  exercise!.value.goal = values.goal
  editing.value = false
}

</script>

<template>
  <main class="relative flex flex-1 flex-col w-full max-w-[1440px] items-center mx-auto gap-4 dark:text-white">
    <section
        class="inline-flex sticky w-full max-w-screen-md justify-center top-0 h-10 z-10 items-center text-xl font-semibold gap-2 dark:text-neo-green dark:bg-black bg-white">
      <Icon icon="material-symbols:keyboard-backspace-rounded" class="absolute text-2xl left-0 cursor-pointer"
            @click="returnToBack"/>
      <span class="inline-flex items-center gap-2">
        Упражнение
        <Icon icon="material-symbols:edit-outline-rounded"
              class="cursor-pointer text-2xl"
              @click="toggleEditing" v-if="editExercise && !editing"/>
        <Icon icon="material-symbols:edit-off-outline-rounded"
              class="cursor-pointer text-2xl"
              @click="toggleEditing"
              v-else-if="editing && editExercise && localHistory![localHistory!.length - 2] === 0"/>
        <Icon icon="material-symbols:delete-rounded" class="text-2xl text-danger cursor-pointer"
              @click="removeExercise" v-if="!!editExercise && localHistory![localHistory!.length - 2] === 0"/>
      </span>
    </section>
    <section class="flex flex-col gap-4">
      <div class="flex w-full shrink-0 h-20 gap-4">
        <div class="w-20">
          <img :src="exercise?.exercise?.images[0]" v-if="exercise?.exercise?.images"
               class="rounded-full object-cover w-full h-full select-none" alt="Exercise image">
        </div>
        <div class="flex flex-col flex-1">
          <span class="flex-1 text-sm line-clamp-2">{{ exercise?.exercise?.name }}</span>
          <span class="flex-1 text-gray line-clamp-2 text-sm">{{ genTags(exercise?.exercise!) }}</span>
        </div>
      </div>
    </section>

    <form class="flex flex-col gap-4 max-w-screen-md w-full" aria-label="Форма создания упражнения">
      <div class="flex flex-col">
        <label for="goal-type-select">Тип цели</label>
        <Field name="goalType" as="select" id="goal-type-select" v-if="editing" @change="onChange"
               class="bg-transparent border border-gray rounded-md p-1">
          <option :value="type" class="text-gray" v-for="type in goalType">{{ type }}</option>
        </Field>
        <span class="dark:text-neo-green text-xl" v-else>{{ exercise?.goalType }}</span>
      </div>
      <div class="flex flex-col">
        <label for="goal-input">Цель</label>
        <CustomInput name="goal" id="goal-input" placeholder="Цель" v-if="editing" type="number"></CustomInput>
        <span class="dark:text-neo-green text-2xl" v-else>{{ exercise?.goal }}</span>
      </div>
      <span class="text-warning">{{ warnings }}</span>
      <Button class="bg-neo-green text-black" @click="addExercise" v-if="localHistory![localHistory!.length - 2] === 1">
        Добавить
      </Button>
      <Button class="bg-neo-green text-black" @click="saveExercise" type="button"
              v-else-if="localHistory![localHistory!.length - 2] === 0 && editing">Сохранить
      </Button>
    </form>
  </main>
</template>

<style scoped>

</style>