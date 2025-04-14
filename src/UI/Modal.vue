<script setup lang="ts">

import {computed, watch} from "vue";
import {Icon} from "@iconify/vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  selfCloseable: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['selfCloseModal'])

const isModalOpen = computed(() => props.show)

const closeModal = () => {
  if (props.selfCloseable) {
    emit('selfCloseModal')
  }
}

watch(isModalOpen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
})

</script>

<template>
  <teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed left-0 top-0 w-full h-screen z-50 bg-black flex transition-opacity duration-300">
        <div class="modal-container m-auto w-auto p-5 bg-[#414040] dark:bg-[#202020] transition-all duration-300
                  rounded-lg text-white min-w-[250px] relative inline-flex flex-col gap-2 items-center">
          <slot name="header"></slot>
          <div
              class="absolute right-2 top-2 text-gray text-2xl cursor-pointer hover:text-danger transition-all z-10"
              v-if="selfCloseable">
            <Icon icon="material-symbols:close-rounded" @click="closeModal"/>
          </div>
          <slot name="body"></slot>

          <slot name="footer"></slot>
        </div>
      </div>
    </Transition>
  </teleport>
</template>

<style>

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(1.1);
}
</style>