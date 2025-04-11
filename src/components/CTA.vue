<script setup>
import translations from '@/translations/translations.json'
import  { getIcon } from '@/utils'
</script>

<template>
   <button 
        class="flex justify-center items-center w-full px-3 rounded-full bg-gray-dark border-blue border-2 h-12"
        @click="$emit('ctaClicked')"
    >
        <div class=" h-[40px] w-[40px] flex justify-center items-center">
            <component :is="getIcon(translations.CTA.icon)"/>
        </div>
        <p class="font-PeugeotNewBold text-xs text-white">{{ translations.CTA.label }}</p>
    </button>
</template>


