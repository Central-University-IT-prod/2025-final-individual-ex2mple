<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import { getCookie, setCookie } from '@/helpers/cookieManager.ts'

const getThemeState = (): boolean => {
  const settings = getCookie('settings')
  if (settings) {
    return JSON.parse(settings).darkMode
  } else {
    setCookie('settings', JSON.stringify({ darkMode: true }))
    return true
  }
}

const switchPageTheme = (): void => {
  isDark.value = !isDark.value
  setCookie('settings', JSON.stringify({ darkMode: isDark.value }))
  document.documentElement.classList.toggle('dark')
}

const isDark = ref(getThemeState())

if (isDark.value) {
  document.documentElement.classList.add('dark')
}
</script>


<template>
  <header class="sticky mx-auto my-2 bottom-2 flex w-full h-16 max-w-[1440px] justify-center z-50">
    <nav
      class="flex items-center justify-between w-full h-full sm:!h-full px-4 bg-neo-green rounded-xl text-black overflow-hidden">
      <router-link class="text-3xl font-bold md:block hidden" to="/" tabindex="1" title="Начальная страница">Gym Tracker</router-link>
      <div class="flex items-center sm:gap-4 gap-2 md:w-auto w-full justify-between">
        <router-link to="/main" tabindex="2" title="Главная страница">
          <div class="flex flex-col items-center hover:text-black/70 transition-colors">
            <Icon icon="material-symbols:home-rounded" class="md:text-xl text-3xl" />
            <span class="sm:text-sm text-[0.75rem]">Главная</span>
          </div>
        </router-link>
        <router-link to="/catalog" tabindex="3" title="Каталог упражнений">
          <div class="flex flex-col items-center hover:text-black/70 transition-colors">
            <Icon icon="material-symbols:book-2-rounded" class="md:text-xl text-3xl" />
            <span class="sm:text-sm text-[0.75rem]">Каталог</span>
          </div>
        </router-link>
        <router-link to="/programs" tabindex="4" title="Каталог тренировок">
          <div class="flex flex-col items-center hover:text-black/70 transition-colors">
            <Icon icon="material-symbols:sports-gymnastics-rounded" class="md:text-xl text-3xl" />
            <span class="sm:text-sm text-[0.75rem]">Тренировки</span>
          </div>
        </router-link>
        <router-link to="/character" tabindex="5" title="Персонаж">
          <div class="flex flex-col items-center hover:text-black/70 transition-colors">
            <Icon icon="material-symbols:face-6" class="md:text-xl text-3xl" />
            <span class="sm:text-sm text-[0.75rem]">Персонаж</span>
          </div>
        </router-link>
      </div>
      <div class="flex items-center ml-4">
        <button @click="switchPageTheme" v-if="isDark" title="Темный режим">
          <Icon icon="material-symbols:dark-mode-rounded" />
        </button>
        <button @click="switchPageTheme" v-else title="Светлый режим">
          <Icon icon="material-symbols:light-mode-rounded" />
        </button>
      </div>
    </nav>
  </header>
</template>

<style scoped>

</style>