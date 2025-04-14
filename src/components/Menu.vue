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
  <div class="text-white h-full flex flex-col items-center justify-start pt-4 tall:pt-12 px-[12px]">
    <!-- Header -->
    <div class="flex justify-between items-center w-full mb-4">
      <GeniusIcon class="w-[50px] h-[50px]" />
      <p v-if="userInfo" class="text-white text-xs font-PeugeotNew">
        {{ `Hello, ${userInfo.name || 'there'}` }}
      </p>
    </div>

    <!-- Title -->
    <div class="flex flex-col font-PeugeotNewBold uppercase text-[16px] leading-5 mb-3 w-full">
      <p class="text-white leading-5">
        {{ translations.Menu.titleWhite }}
      </p>
      <p class="text-blue leading-5">
        {{ `${translations.Menu.titleBlue}` }}
      </p>
    </div>

    <!-- Subtitle + Legal Notice -->
    <div class="text-white text-[10px] leading-4 font-PeugeotNew pr-2 w-full mb-6">
      <p class="mb-1">
        {{ translations.Menu.subTitle }}
      </p>
      <p class="text-gray opacity-80 italic text-[8px] leading-3">
        {{ translations.Menu.legalNotice }}
        <a :href="translations.Menu.legalLinkUrl" target="_blank" rel="noopener noreferrer">
          {{ translations.Menu.legalLinkLabel }}
        </a>
      </p>
    </div>

<!-- Menu Buttons + CTA Block -->
<div class="flex flex-col items-center justify-center gap-4 w-full mt-1 mb-1">
  <!-- Grid Buttons -->
  <div class="grid grid-cols-2 gap-2 tall:gap-3 w-full">
    <button
      v-for="(block, index) in translations.Menu.blocks"
      :key="index"
      class="flex flex-row items-center justify-start gap-3 px-4 py-3 rounded-3xl bg-blue-gray min-h-[64px]"
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
  
  <!-- CTA -->
  <div class="w-full px-4 mt-4">
    <div class="max-w-[300px] mx-auto">
      <CTA @cta-clicked="$emit('ctaClicked')" />
    </div>
  </div>
</div>
  </div>
</template>