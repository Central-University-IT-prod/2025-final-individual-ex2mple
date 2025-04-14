<script setup lang="ts">
import {useForm} from 'vee-validate'
import * as yup from 'yup'
import CustomInput from '@/UI/CustomInput.vue'
import Button from '@/UI/Button.vue'
import DBHelper from '@/helpers/dbHelper.ts'
import type {Exercise, Program, User} from '@/types.ts'
import router from '@/router'
import defaultExercises from "@/assets/defaultExercises.json" with {type: 'json'}
import defaultPrograms from "@/assets/defaultPrograms.json" with {type: 'json'}


const {handleSubmit, setFieldValue} = useForm({
  validationSchema: yup.object({
    name: yup.string().required('Это обязательное поле').min(2, 'Минимальная длина имени — 2 символа'),
    height: yup.number().typeError('').min(100, 'Рост должен быть не менее 100 см').required('Это обязательное поле'),
    weight: yup.number().typeError('').min(10, 'Вес должен быть не менее 10 кг').required('Это обязательное поле'),
    goal: yup.string()
        .oneOf(['Накачаться', 'Похудеть'], 'Пожалуйста, выберите цель')
        .required('Это обязательное поле')
  })
})

const onSubmit = handleSubmit(values => {
  const characterDB = new DBHelper<User>('users')
  const exerciseDB = new DBHelper<Exercise>('exercises')
  const programsDB = new DBHelper<Program>('programs')

  exerciseDB.getAllItems().then((exercises) => {
    if (exercises.length === 0) {
      defaultExercises.forEach((exercise: any) => {
        exerciseDB.addItem(exercise);
      });
    }
  });

  programsDB.getAllItems().then((programs) => {
    if (programs.length === 0) {
      defaultPrograms.forEach((program: any) => {
        programsDB.addItem(program);
      });
    }
  });

  characterDB.addItem({
    name: values.name,
    height: values.height,
    weight: values.weight,
    goal: values.goal,
    coins: 0,
    equippedItems: ['', '', ''],
    inventory: [-1, -1, -1],
    createdAt: new Date().toISOString()
  }).then(() => router.push('/character'))
})
</script>

<template>
  <main class="relative flex flex-1 flex-col w-full max-w-[1440px] mx-auto dark:text-white">
    <section class="flex flex-col items-center my-4 gap-2">
      <div class="flex flex-col gap-2">
        <h1 class="text-2xl font-bold dark:text-neo-green text-center">Добро пожаловать!</h1>
        <h3 class="text-xl font-medium text-center">Давайте создадим персонажа</h3>
      </div>
      <form class="flex flex-col self-center gap-4 p-4 max-w-[400px] w-full" @submit="onSubmit"
            aria-label="Форма создания персонажа">
        <CustomInput name="name" placeholder="Придумайте имя"></CustomInput>
        <CustomInput name="height" placeholder="Рост (в см)" type="number"></CustomInput>
        <CustomInput name="weight" placeholder="Вес (в кг)" type="number"></CustomInput>
        <fieldset class="flex flex-col gap-2">
          <legend>Цель тренировок:</legend>
          <span>
          <input id="goal1" type="radio" name="goal" value="Накачаться" @change="setFieldValue('goal', 'Накачаться')"
                 required>
          <label for="goal1" class="ml-2">Накачаться</label>
          </span>
          <span>
            <input id="goal2" type="radio" name="goal" value="Похудеть" @change="setFieldValue('goal', 'Похудеть')"
                   required>
            <label for="goal2" class="ml-2">Похудеть</label>
          </span>
        </fieldset>
        <Button class="bg-neo-green text-black" type="submit">Создать</Button>
      </form>
    </section>
  </main>
</template>

<style scoped>

</style>