<script setup lang="ts">

import {difficultyList, equipmentList, muscleList, typeList} from "@/constants.ts";
import Modal from "@/UI/Modal.vue";
import Button from "@/UI/Button.vue";

const open = defineModel<boolean>('open', {default: false});
const tags = defineModel<any>('tags', {required: true});

const clearFilters = () => {
  tags.value = {name: '', difficulty: [''], equipment: [''], muscleGroup: [''], type: ['']}
}

</script>

<template>
  <modal :self-closeable="true" :show="open" @self-close-modal="open = false">
    <template #header>
      <span class="text-base text-neo-green">Фильтрация</span>
    </template>
    <template #body>
      <section class="flex flex-col gap-4 flex-1">
        <div class="flex flex-col">
          <label for="difficulty-select">Сложность</label>
          <select v-model="tags.difficulty" id="difficulty-select"
                  class="bg-transparent border border-gray rounded-md p-1" multiple>
            <option :value="difficulty" class="dark:text-gray mt-1" v-for="difficulty in difficultyList">{{
                difficulty
              }}
            </option>
          </select>
        </div>
        <div class="flex flex-col">
          <label for="muscle-select">Группы мышц</label>
          <select v-model="tags.muscleGroup" id="muscle-select"
                  class="bg-transparent border border-gray rounded-md p-1" multiple>
            <option :value="muscle" class="dark:text-gray mt-1" v-for="muscle in muscleList">{{ muscle }}</option>
          </select>
        </div>
        <div class="flex flex-col">
          <label for="equipment-select">Тип оборудования</label>
          <select v-model="tags.equipment" id="equipment-select"
                  class="bg-transparent border border-gray rounded-md p-1" multiple>
            <option :value="equipment" class="dark:text-gray mt-1" v-for="equipment in equipmentList">{{
                equipment
              }}
            </option>
          </select>
        </div>
        <div class="flex flex-col">
          <label for="type-select">Вид упражнения</label>
          <select v-model="tags.type" id="type-select"
                  class="bg-transparent border border-gray rounded-md p-1" multiple>
            <option :value="type" class="dark:text-gray mt-1" v-for="type in typeList">{{ type }}</option>
          </select>
        </div>
      </section>
    </template>
    <template #footer>
      <Button @click="open = false" class="flex items-center md:top-20
            justify-center bottom-20 mt-auto  bg-neo-green text-black z-10">Показать упражнения
      </Button>
      <Button @click="clearFilters" class="flex items-center md:top-20
            justify-center bottom-20 mt-auto  bg-neo-green text-black z-10">Очистить
      </Button>
    </template>
  </modal>
</template>

<style scoped>

</style>