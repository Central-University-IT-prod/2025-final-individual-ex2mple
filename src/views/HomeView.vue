<script setup lang="ts">

</script>

<template>
  <main class="relative flex flex-1 flex-col w-full max-w-[1440px] mx-auto ">
    <div class="flex flex-col items-center mx-auto my-auto">

      <img src="@/assets/trophy.png" alt="trophy" class="absolute -z-10 bottom-1/2 left-0 lg:w-auto w-1/2">
      <img src="@/assets/medal.png" alt="medal" class="absolute -z-10 top-1/2 right-0 lg:w-auto w-1/2">

      <div
        class="flex flex-col items-center p-6 rounded-lg gap-2 bg-white backdrop-filter
         backdrop-blur-sm bg-opacity-10 outline outline-1 dark:outline-white/40 outline-black/40">
        <h1 class="text-5xl font-bold dark:text-neo-green text-center">Gym Tracker</h1>
        <h2 class="text-xl font-medium dark:text-white">Спорт — это интересно</h2>
        <router-link class="bg-neo-green p-2 rounded-lg text-md" to="/reg">
          Начать
        </router-link>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>