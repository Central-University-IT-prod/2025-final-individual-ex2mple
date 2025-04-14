<script setup lang="ts">

import {exportConfig} from "@/helpers/exportConfig.ts";
import {importConfig} from "@/helpers/importConfig.ts";
import {Icon} from "@iconify/vue";
import CustomInput from "@/UI/CustomInput.vue";
import {computed, onMounted, ref} from "vue";
import type {Program} from "@/types.ts";
import DBHelper from "@/helpers/dbHelper.ts";
import {filterItems} from "@/helpers/filterHelper.ts";
import router from "@/router";

const searchOpen = ref(false)
const sortCriteria = ref({name: ''});
const programs = ref<Program[]>([])

onMounted(() => {
  const db = new DBHelper<Program>('programs');
  db.getAllItems().then((data) => programs.value = data)
})

const filteredPrograms = computed((): Program[] => {
  return (filterItems(programs.value, sortCriteria.value) as Program[])
})

const openProgram = (program: Program) => {
  router.push('/program?id=' + program.id)
}

</script>

<template>
  <main class="relative flex flex-1 flex-col w-full max-w-[1440px] mx-auto gap-4 dark:text-white">
    <section
        class="inline-flex sticky top-0 h-10 items-center text-xl font-semibold gap-2 dark:text-neo-green dark:bg-black bg-white">
      <div class="inline-flex gap-2" v-if="!searchOpen">
        <span class="">Тренировки</span>
        <Icon icon="material-symbols:search-rounded" class="text-2xl hover:cursor-pointer" @click="searchOpen = true"/>
        <router-link to="/program" title="Создать программу">
          <Icon icon="material-symbols:add-2-rounded" class="text-2xl hover:cursor-pointer"/>
        </router-link>
        <Icon icon="material-symbols:upload-rounded" class="text-2xl hover:cursor-pointer" @click="exportConfig('programs')"/>
        <div class="relative">
          <Icon icon="material-symbols:download-rounded" class="text-2xl"/>
          <input type="file" title="Импорт файла" accept="application/json" @change="(event) => importConfig(event, 'programs')"
                 class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
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
      <div class="flex w-full shrink-0 h-20 gap-4 cursor-pointer" v-for="program in filteredPrograms"
           @click="openProgram(program)">
        <div class="flex flex-col flex-1">
          <span class="text-base line-clamp-2">{{ program.name }}</span>
          <span class="flex-1 text-gray line-clamp-2 text-sm">{{ program.description }}</span>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>

</style>