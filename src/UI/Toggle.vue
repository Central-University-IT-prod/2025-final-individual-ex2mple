<script setup lang="ts">

const props = defineProps({
  id: {
    required: true,
    type: String
  }
})

const model = defineModel()
</script>

<template>
  <div class="flex w-12 h-6">
    <input type="checkbox" :id="props.id" class="peer" v-model="model" />
    <label :for="props.id"
           class="w-full h-full peer-checked:bg-neo-green
           after:w-[30%] after:h-[60%] bg-gray">
    </label>
  </div>
</template>

<style scoped>
input[type=checkbox] {
  height: 0;
  width: 0;
  visibility: hidden;
}

label {
  cursor: pointer;
  text-indent: -9999px;
  display: block;
  border-radius: 999px;
  position: relative;
}

label:after {
  content: '';
  position: absolute;
  top: 20%;
  left: 10%;
  background: #fff;
  border-radius: 999px;
  transition: 0.3s ease-in-out;

}

input:checked + label:after {
  left: calc(100% - 10%);
  transform: translateX(-100%);
}

</style>