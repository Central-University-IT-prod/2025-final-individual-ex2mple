<script setup lang="ts">
import DBHelper from '@/helpers/dbHelper.ts'
import type {User, Workout} from '@/types.ts'
import {type Ref, ref, toRaw, watch} from 'vue'
import CharacterImage from "@/components/CharacterImage.vue";
import {Field, useForm} from "vee-validate";
import * as yup from "yup";
import Button from "@/UI/Button.vue";
import CustomInput from "@/UI/CustomInput.vue";
import {Icon} from "@iconify/vue";
import Shop from "@/components/Shop.vue";

const CATEGORY_SELECTORS = ["#Hair", "#Shirt", "#Pants"];
const userData: Ref<User | null> = ref(null)
const bodyType = ref<number>(0)
const editing = ref(false)

const {handleSubmit, setValues} = useForm({
  validationSchema: yup.object({
    name: yup.string().required('Это обязательное поле').min(2, 'Минимальная длина имени — 2 символа'),
    height: yup.number().typeError('').min(100, 'Рост должен быть не менее 100 см').required('Это обязательное поле'),
    weight: yup.number().typeError('').min(10, 'Вес должен быть не менее 10 кг').required('Это обязательное поле'),
    goal: yup.string()
        .oneOf(['Накачаться', 'Похудеть'], 'Пожалуйста, выберите цель')
        .required('Это обязательное поле')
  })
})


const characterDB = new DBHelper<User>('users')
characterDB.getLastItem().then((data: User | null) => {
  userData.value = data
  bodyType.value = data?.goal === 'Накачаться' ? 0 : -2
  setValues(data!)

  const workoutDB = new DBHelper<Workout>('workouts')
  workoutDB.getAllItems().then(workouts => {
    if (workouts.length >= 20) {
      bodyType.value += 1
    }
    if (workouts.length >= 40) {
      bodyType.value += 1
    }
    setTimeout(() => applyStyles(), 1);
  })
})

const toggleEditing = () => {
  setValues(userData.value!)
  editing.value = !editing.value;
}

const onSave = handleSubmit((values) => {
  const characterDB = new DBHelper<User>('users')
  characterDB.updateItem(values as User).then(() => {
    userData.value = values as User
    editing.value = false
  })
})

function applyStyles() {
  userData.value?.equippedItems?.forEach((item, index) => {
    const element = document.querySelector(CATEGORY_SELECTORS[index]);
    if (element && item !== '') {
      element.querySelectorAll("*").forEach((el) => {
        el.style.fill = item;
      });
    }
  });
}


watch(() => userData.value?.equippedItems, () => {
  if (!userData.value) return;
  const characterDB = new DBHelper<User>('users')
  characterDB.updateItem(toRaw(userData.value))
  applyStyles()
}, { deep: true });

</script>

<template>
  <main class="relative flex flex-1 w-full flex-col max-w-[1440px] mx-auto pt-2 gap-4 dark:text-white">
    <span class="flex items-center gap-2 text-3xl font-semibold dark:text-neo-green">
      Это Вы
      <Icon icon="material-symbols:edit-outline-rounded"
            class="cursor-pointer text-2xl"
            @click="toggleEditing" v-if="!editing"/>
        <Icon icon="material-symbols:edit-off-outline-rounded"
              class="cursor-pointer text-2xl"
              @click="toggleEditing" v-else-if="editing"/>
    </span>
    <div class="flex justify-center md:max-w-[400px] h-[400px] w-full">
      <CharacterImage :body-type="bodyType"></CharacterImage>
    </div>
    <div class="flex flex-col gap-4" v-if="!editing">
      <div class="flex flex-col">
        <span>Рост:</span>
        <span class="text-3xl dark:text-neo-green">{{ userData?.height }}</span>
      </div>
      <div class="flex flex-col">
        <span>Вес:</span>
        <span class="text-3xl dark:text-neo-green">{{ userData?.weight }}</span>
      </div>
      <div class="flex flex-col">
        <span>Цель:</span>
        <span class="text-3xl dark:text-neo-green">{{ userData?.goal }}</span>
      </div>
      <div class="flex flex-col">
        <span>Баланс:</span>
        <span class="text-3xl dark:text-neo-green">{{ userData?.coins }}</span>
      </div>
    </div>
    <form class="flex flex-col gap-4 p-4 max-w-[400px] w-full" @submit="onSave" v-if="editing"
          aria-label="Форма редактирования персонажа">
      <CustomInput name="height" placeholder="Рост (в см)" type="number"></CustomInput>
      <CustomInput name="weight" placeholder="Вес (в кг)" type="number"></CustomInput>
      <label for="goal-select">Цель тренировок</label>
      <Field name="goal" as="select" id="goal-select" class="bg-transparent border border-gray rounded-md p-1">
        <option class="text-gray mt-1" value="Накачаться">Накачаться</option>
        <option class="text-gray mt-1" value="Похудеть">Похудеть</option>
      </Field>
      <Button class="bg-neo-green text-black" type="submit">Сохранить</Button>
    </form>
    <section class="flex flex-col border-t pt-2 gap-2" v-if="!editing">
      <h3 class="text-3xl font-semibold dark:text-neo-green">Магазин</h3>
      <Shop v-model:user-data="userData!"></Shop>
    </section>
  </main>
</template>

<style scoped>

</style>