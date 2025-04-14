<script setup lang="ts">

import type {User} from "@/types.ts";
import DBHelper from "@/helpers/dbHelper.ts";
import {toRaw} from "vue";

const colors = ['#008000', '#e52b50', '#FFA500', '#9400D3']
const categories = ['Цвет волос', 'Цвет футболки', 'Цвет штанов']

const user = defineModel<User>('userData')

const buyItem = (categoryIndex: number, color: string) => {
  if (user.value!.coins < 50) {
    alert('У вас недостаточно баллов для покупки предмета')
    return
  }
  user.value!.coins -= 50
  user.value!.inventory[categoryIndex] += 1
  user.value!.equippedItems[categoryIndex] = color
  const characterDB = new DBHelper<User>('users')
  characterDB.updateItem(toRaw(user.value!))
}

const pickItem = (categoryIndex: number, color: string) => {
  user.value!.equippedItems[categoryIndex] = color
}

</script>

<template>
  <section class="flex flex-col gap-4">
    <div class="flex flex-col" v-for="(category, categoryIndex) in categories">
      <h4 class="text-xl">{{ category }}</h4>
      <div class="inline-flex items-center w-full gap-2 overflow-auto">
        <div class="flex relative shrink-0 w-20 h-20 border border-gray items-center rounded-xl justify-center cursor-pointer"
             :class="{'opacity-30 cursor-not-allowed': userData?.inventory[categoryIndex]!<index,
             '!opacity-100 !cursor-pointer': userData?.inventory[categoryIndex]!+1==index}"
             v-for="(color, index) in colors">
          <div class="w-10 h-10 rounded-full" :style="{'background-color': color}"></div>
          <button class="absolute text-xl rounded-xl w-full h-full text-black bg-gray/40 bg-opacity-80"
                  title="Купить предмет"
                  @click="buyItem(categoryIndex, color)" v-if="userData?.inventory[categoryIndex]!+1==index">
            50
          </button>
          <button class="absolute w-full h-full" @click="pickItem(categoryIndex, color)" title="Применить предмет"
                  v-if="userData?.inventory[categoryIndex]!>=index"></button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>