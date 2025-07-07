<script setup>
import translations from '@/translations/translations.json'
// import  { getIcon } from '@/utils'

const props = defineProps(['index'])
</script>

<template>
  <div class="flex flex-col px-4 h-full pt-8 tall:pt-12">
    <div class="flex flex-col font-PeugeotNewBold uppercase text-xl xs:text-2xl mb-2 mt-4 tall:mb-4">
        <p class="text-white leading-3 xs:leading-8">
            {{ translations.Menu.blockDetails[index].titleWhite }}
        </p>
        <p class="text-blue leading-6 xs:leading-8">
            {{ translations.Menu.blockDetails[index].titleBlue }}
        </p>
    </div>
    <div class="text-white text-xs xs:text-sm font-PeugeotNew mb-4">
        <p class="leading-4 xs:leading-6">
            {{ translations.Menu.blockDetails[index].subTitle }}
        </p>
    </div>
    <div class="grid grid-cols-1 gap-4 my-auto tall:gap-5">
        <button 
        v-for="(subBlock, index) in translations.Menu.blockDetails[index].subBlocks"
        :key="index"
        class="flex items-center px-3 rounded-2xl border-transparent bg-blue-gray h-12 tall:h-14"
        @click="$emit('subBlockSelected', subBlock.title)"
        >
          <!-- <component
              :is="getIcon(subBlock.icon)"
              class="mx-2"
          /> -->
          <div class=" pl-2 text-white text-start">
            <p class="font-PeugeotNew uppercase text-[8px] tall:text-[10px]">{{ subBlock.title }}</p>
          </div>
        </button>
    </div>
  </div>
</template>


