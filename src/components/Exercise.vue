<script setup lang="ts">

import {difficultyList, equipmentList, muscleList, typeList} from "@/constants.ts";
import Button from "@/UI/Button.vue";
import {Icon} from "@iconify/vue";
import CustomInput from "@/UI/CustomInput.vue";
import {Field, useForm} from "vee-validate";
import DBHelper from "@/helpers/dbHelper.ts";
import type {Exercise} from "@/types.ts";
import {ref, toRaw} from "vue";
import router from "@/router";
import * as yup from "yup";
import {useRoute} from "vue-router";

const route = useRoute();
const exerciseImages = ref<string[]>([])
const id = Number(route.query.id) || null;
const editing = ref<boolean>(!id)
const cachedValues = ref()


const {handleSubmit, setValues} = useForm<Exercise>({
  validationSchema: yup.object({
    name: yup.string().required('Это обязательное поле'),
  })
})

if (id) {
  const exerciseDB = new DBHelper<Exercise>('exercises')
  exerciseDB.getItem(id).then((exercise) => {
    setValues(exercise!)
    exerciseImages.value = exercise?.images || []
    cachedValues.value = exercise!
  })
}

const toggleEditing = () => {
  setValues(cachedValues.value)
  editing.value = !editing.value;
}

const removeExercise = () => {
  if (confirm('Вы точно хотите удалить упражнение?')) {
    const exerciseDB = new DBHelper<Exercise>('exercises')
    exerciseDB.deleteItem(id!).then(() => router.go(-1))
  }
}

const onSubmit = handleSubmit((values) => {
  const exerciseDB = new DBHelper<Exercise>('exercises')
  values.images = toRaw(exerciseImages.value)
  exerciseDB.addItem(values as Omit<Exercise, "id">).then(() => router.push('/catalog'))
})

const onSave = handleSubmit((values) => {
  const exerciseDB = new DBHelper<Exercise>('exercises')
  values.images = toRaw(exerciseImages.value)
  exerciseDB.updateItem(values as Omit<Exercise, "id">).then(() => router.go(-1))
})

const handleImageUpload = (e: any) => {
  const reader = new FileReader();
  reader.readAsDataURL(e.target.files[0]);
  reader.onload = () => {
    exerciseImages.value.push(reader.result as string)
  }
}

const removeImage = (index: number) => {
  exerciseImages.value.splice(index, 1)
}
</script>

<template>
  <section
      class="inline-flex sticky w-full max-w-screen-md justify-center top-0 h-10 z-10 items-center text-xl font-semibold gap-2 dark:text-neo-green dark:bg-black bg-white">
    <Icon icon="material-symbols:keyboard-backspace-rounded" class="absolute text-2xl left-0 cursor-pointer"
          @click="router.go(-1)"/>
    <span class="inline-flex items-center gap-2">
        Упражнение
        <Icon icon="material-symbols:edit-outline-rounded"
              class="cursor-pointer text-2xl"
              @click="toggleEditing" v-if="!editing && id"/>
        <Icon icon="material-symbols:edit-off-outline-rounded"
              class="cursor-pointer text-2xl"
              @click="toggleEditing" v-else-if="!!editing && id"/>
        <Icon icon="material-symbols:delete-rounded" class="text-2xl text-danger cursor-pointer"
              @click="removeExercise" v-if="!!id"/>
      </span>
  </section>
  <form class="flex flex-col gap-4 max-w-screen-md w-full" @submit="onSubmit" aria-label="Форма создания упражнения">
    <CustomInput name="name" placeholder="Название*" v-if="editing"></CustomInput>
    <span class="dark:text-neo-green text-2xl" v-else>{{ cachedValues?.name }}</span>
    <CustomInput name="description" placeholder="Описание" v-if="editing"></CustomInput>
    <span class="text-gray text-base" v-else>{{ cachedValues?.description }}</span>
    <div class="flex gap-4 overflow-auto">
      <div v-for="(exerciseImage, index) in exerciseImages" class="relative flex shrink-0">
        <img :src="exerciseImage" class="object-contain h-64" alt="Item image">
        <Icon icon="material-symbols:delete-rounded" class="text-2xl text-danger cursor-pointer"
              @click="removeImage(index)" v-if="editing"/>
      </div>
    </div>
    <input type="file" name="file" accept="image/jpeg, .png" @change="handleImageUpload" v-if="editing">
    <div class="flex flex-col">
      <label for="difficulty-select">Сложность упражнения</label>
      <Field name="difficulty" as="select" id="difficulty-select" v-if="editing"
             class="bg-transparent border border-gray rounded-md p-1">
        <option :value="difficulty" class="text-gray" v-for="difficulty in difficultyList">{{ difficulty }}</option>
      </Field>
      <span class="dark:text-neo-green text-xl" v-else>{{ cachedValues?.difficulty }}</span>
    </div>
    <div class="flex flex-col">
      <label for="equipment-select">Тип оборудования</label>
      <Field name="equipment" as="select" id="equipment-select" v-if="editing"
             class="bg-transparent border border-gray rounded-md p-1">
        <option :value="equipment" class="text-gray" v-for="equipment in equipmentList">{{ equipment }}</option>
      </Field>
      <span class="dark:text-neo-green text-xl" v-else>{{ cachedValues?.equipment }}</span>
    </div>
    <div class="flex flex-col">
      <label for="muscle-select">Группы мышц</label>
      <Field name="muscleGroup" as="select" id="muscle-select" v-if="editing"
             class="bg-transparent border border-gray rounded-md p-1" multiple>
        <option :value="muscle" class="text-gray mt-1" v-for="muscle in muscleList">{{ muscle }}</option>
      </Field>
      <span class="dark:text-neo-green text-xl" v-else>{{ cachedValues?.muscleGroup?.join(', ') }}</span>
    </div>
    <div class="flex flex-col">
      <label for="type-select">Вид упражнения</label>
      <Field name="type" as="select" id="type-select" class="bg-transparent border rounded-md p-1 border-gray"
             v-if="editing">
        <option :value="type" class="text-gray" v-for="type in typeList">{{ type }}</option>
      </Field>
      <span class="dark:text-neo-green text-xl" v-else>{{ cachedValues?.type }}</span>
    </div>
    <Button class="bg-neo-green text-black" type="submit" v-if="!id">Добавить</Button>
    <Button class="bg-neo-green text-black" type="button" @click="onSave" v-else-if="!!id && editing">Сохранить
    </Button>
  </form>
</template>

<style scoped>

</style>