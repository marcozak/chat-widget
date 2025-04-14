<script setup>
import GeniusIcon from '@/components/GeniusIcon.vue'
import CTA from '@/components/CTA.vue'
import LogoutButton from '@/components/LogoutButton.vue'

import translations from '@/translations/translations.json'
import { getIcon } from '@/utils'
import { getUserInfo } from '@/utils/auth'

// Get user info for display
const userInfo = getUserInfo()
</script>

<template>
    <div class="text-white h-full flex flex-col items-center pt-4 tall:pt-12 px-[12px]">
        <div class="flex justify-between items-center mb-1 tall:mb-2" >
            <GeniusIcon class="w-[50px] h-[50px]"/>
            
            <!-- User greeting if available -->
            <p v-if="userInfo" class="text-white text-xs font-PeugeotNew">
                {{ `Hello, ${userInfo.name || 'there'}` }}
            </p>
        </div>
        <div class="flex flex-col font-PeugeotNewBold uppercase text-[16px] leading-5 mb-1">
    <p class="text-white leading-5">
        {{ translations.Menu.titleWhite }}
    </p>
    <p class="text-blue leading-5">
        {{ `${translations.Menu.titleBlue}` }}
    </p>
</div>
<div class="text-white text-[10px] leading-4 font-PeugeotNew pr-2">
    <p class="mb-1">
        {{ translations.Menu.subTitle }}
    </p>
    <p class="text-gray opacity-80 italic text-[8px] leading-3">
        {{ translations.Menu.legalNotice }} <a :href="translations.Menu.legalLinkUrl" target="_blank" rel="noopener noreferrer">{{ translations.Menu.legalLinkLabel }}</a>
    </p>
</div>

<div class="flex h-full items-center mb-36">
  <div class="grid grid-cols-2 gap-2 tall:gap-3">
    <button 
      v-for="(block, index) in translations.Menu.blocks"
      :key="index"
      class="flex flex-row items-center justify-start gap-3 px-4 py-3 rounded-3xl bg-blue-gray min-h-[64px] max-w-[170px]"
      @click="$emit('blockCliked', Number(index))"
    >
      <div class="bg-blue rounded-full h-[36px] w-[36px] flex justify-center items-center shrink-0">
        <component :is="getIcon(block.icon)" />
      </div>
      <p class="font-PeugeotNewBold text-white text-left text-[9px] sm:text-[10px] leading-tight break-words max-w-[110px]">
        {{ block.label }}
      </p>
    </button>
  </div>
</div>

<div class="absolute bottom-24 tall:mb-1 w-full flex justify-center">
  <CTA @cta-clicked="$emit('ctaClicked')" />
</div>


    </div>
</template>