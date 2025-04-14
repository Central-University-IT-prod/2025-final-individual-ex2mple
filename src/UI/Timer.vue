<script setup lang="ts">
import {ref, computed, watch} from 'vue';

const props = defineProps({
      target: {
        type: Number,
        required: false
      }
    }
)

const currentExerciseIndex = defineModel<number>('current', {required: false})

const emit = defineEmits(['finishExercise'])

const time = ref(0); // Время в секундах
const isRunning = ref(false);
let interval: ReturnType<typeof setInterval> | null = null;

const formattedTime = computed(() => {
  const minutes = Math.floor(time.value / 60).toString().padStart(2, '0');
  const seconds = (time.value % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
});

const toggleTimer = () => {
  if (!isRunning.value) {
    isRunning.value = true;
    interval = setInterval(() => {
      time.value++;
    }, 1000);
  } else {
    stopTimer()
  }
};

const stopTimer = () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  isRunning.value = false;
};

toggleTimer()

watch(() => time.value, () => {
  if (props.target && time.value === props.target) {
    emit('finishExercise')
  }
})
</script>

<template>
  <div class="flex flex-col mt-2 cursor-pointer w-auto" @click="toggleTimer">
    <p class="text-3xl" :class="{'text-danger': !isRunning}">{{ formattedTime }}</p>
    <p class="text-sm text-gray">Нажмите чтобы запустить/остановить</p>
  </div>
</template>

<style scoped>

</style>
