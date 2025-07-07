<script setup>
const props = defineProps(['suggestions'])
</script>

<template>
   <div class="pb-5 pt-2 pl-5 text-white font-PeugeotNew text-[10px]">
      <button
          v-for="(suggestion, index) in suggestions"
          :key="index"
          @click="$emit('sendSuggestion', suggestion)"
          class="border rounded-full bg-transparent font-PeugeotNew text-[10px] text-white px-2 py-2 mr-2 mt-2 italic text-left"
      >
          {{ suggestion }}
      </button>
  </div>
</template>


