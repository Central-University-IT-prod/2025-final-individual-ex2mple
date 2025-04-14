import {createRouter, createWebHashHistory} from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import RegView from '@/views/RegView.vue'
import DBHelper from '@/helpers/dbHelper.ts'
import type { User } from '@/types.ts'
import CharacterView from '@/views/CharacterView.vue'
import MainView from '@/views/MainView.vue'
import CatalogView from '@/views/CatalogView.vue'
import ExerciseView from "@/views/ExerciseView.vue";
import ProgramsCatalogView from "@/views/ProgramsCatalogView.vue";
import ProgramView from "@/views/ProgramView.vue";
import WorkoutView from "@/views/WorkoutView.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/main',
      name: 'main',
      component: MainView,
      meta: {requireCharacter: true},
    },
    {
      path: '/workout',
      name: 'workout',
      component: WorkoutView,
      meta: {requireCharacter: true},
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: CatalogView,
      meta: {requireCharacter: true},
    },
    {
      path: '/exercise',
      name: 'exercise',
      component: ExerciseView,
      meta: {requireCharacter: true},
    },
    {
      path: '/programs',
      name: 'programs',
      component: ProgramsCatalogView,
      meta: {requireCharacter: true},
    },
    {
      path: '/program',
      name: 'program',
      component: ProgramView,
      meta: {requireCharacter: true},
    },
    {
      path: '/character',
      name: 'character',
      component: CharacterView,
      meta: {requireCharacter: true},
    },
    {
      path: '/reg',
      name: 'reg',
      component: RegView,
      beforeEnter(to, from, next) {
        const characterDB = new DBHelper<User>('users')
        characterDB.getLastItem().then((data) => {
          if (data) next({ name: 'character' })
          else next()
        })
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const characterDB = new DBHelper<User>('users')
  characterDB.getLastItem().then((data) => {
    if (data || !to.meta.requireCharacter) next()
    else next({ name: 'reg' })
  })
})

export default router
