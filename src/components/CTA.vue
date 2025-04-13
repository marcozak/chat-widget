<script setup>
import translations from '@/translations/translations.json'
import { getIcon } from '@/utils'
</script>

<template>
  <button 
    class="flex items-center justify-center w-full px-3 rounded-full bg-gray-dark border-blue border-2 h-12"
    @click="$emit('ctaClicked')"
  >
    <!-- Icona -->
    <div class="w-[24px] flex justify-center items-center">
      <component :is="getIcon(translations.CTA.icon)" class="h-[20px] w-[20px]" />
    </div>

    <!-- Testo -->
    <p class="font-PeugeotNewBold text-xs text-white ml-2">
  {{ translations.CTA.label }}
</p>

  </button>
</template>



