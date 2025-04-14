<script setup lang="ts">
import {inject, onMounted, type Ref, ref} from "vue";
import type {Program} from "@/types.ts";
import DBHelper from "@/helpers/dbHelper.ts";

const programs = ref<Program[]>([])
const history = inject<Ref<number[]>>('history')!
const program = defineModel<Program>('program')

onMounted(() => {
  const db = new DBHelper<Program>('programs');
  db.getAllItems().then((data) => programs.value = data)
})

const selectProgram = (newProgram: Program): void => {
  program.value = newProgram
  history.value.push(1);
}
</script>

<template>
  <section class="flex flex-col flex-1 gap-4 w-full">
    <div class="flex w-full shrink-0 h-20 gap-4 cursor-pointer" v-for="program in programs"
         @click="selectProgram(program)">
      <div class="flex flex-col flex-1">
        <span class="text-base line-clamp-2">{{ program.name }}</span>
        <span class="flex-1 text-gray line-clamp-2 text-sm">{{ program.description }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>