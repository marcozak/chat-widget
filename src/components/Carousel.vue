<script setup>
import { register } from 'swiper/element/bundle';
register();
import 'swiper/css';
import XIcon from '@/components/icons/XIcon.vue'
import BackArrowIcon from '@/components/icons/BackArrowIcon.vue'
defineEmits(['close'])
import translations from '@/translations/translations.json'
const props = defineProps(['suggestions'])
const assetBaseUrl = window.CHAT_WIDGET_CONFIG?.assetBaseUrl
</script>
        

<template>

    <div class="relative w-full h-full overflow-y-auto pr-1 flex flex-col justify-center"
        style="padding-top: 14px;
">

        <button
            class="absolute top-4 left-4 z-10 flex items-center"
            @click="$emit('go-back')"
            >
            <BackArrowIcon class="w-4 h-4" />
            <p class="text-white text-xs font-PeugeotNew ml-2">
                {{ translations.Menu.back }}
            </p>
        </button>
        <p class="absolute top-4 left-1/2 -translate-x-1/2 text-white font-PeugeotNew text-xs text-center whitespace-nowrap">
            {{ translations.carousel.title }}
        </p>
        
            <swiper-container
                slides-per-view="1.25"
                navigation="true" 
                pagination-dynamic-bullets="true"
                space-between="20"
                centered-slides="true"
                class="pt-4 w-full max-w-[320px] self-center"
            >
                <swiper-slide 
                    v-for="(slide, index) in translations.carousel.slides"
                    :key="index"
                >
                <div class="h-[480px] mt-10 flex justify-center">
                    <div class="h-[120px] w-[125%] absolute top-6 flex items-center justify-center">
                        <img :src="`${assetBaseUrl}/${slide.imageUrl}`" :alt="slide.car" class="">
                    </div>
                    <div class="flex grow justify-center items-center h-full overflow-hidden w-full pb-4">
                        <div class="bg-blue h-[410px] w-full rounded-3xl flex flex-col mt-10 pt-16">
                            <div>
                                <p class="text-white text-center py-2 px-2 font-PeugeotNewBold text-[12px]">{{ slide.car }}</p>
                                <p class="text-white text-center py-2 px-1 font-PeugeotNewBold text-[10px]"> {{ slide.keyMessage }}</p>
                                <p class="text-white text-center px-8 font-PeugeotNew text-[10px]">{{ slide.range }}</p>
                                <p class="text-white text-center pb-2 px-8 font-PeugeotNew text-[10px]">{{ slide.additionalEnergy }}</p>
                            </div>
                            <div class="flex flex-col justify-center items-center h-[220px] pb-4 pt-2 px-6 gap-2.5">
                                <button v-if="slide.showRoomUrl" class="bg-white rounded-full w-full py-3 font-PeugeotNewBold text-[10px] text-blue">
                                    <a :href="slide.showRoomUrl" target="_blank" rel="noopener noreferrer">
                                        {{ translations.carousel.buttons.showRoomLabel }}
                                    </a>
                                </button>
                                <button v-if="slide.configureUrl" class="bg-white rounded-full w-full py-3 font-PeugeotNewBold text-[10px] text-blue">
                                    <a :href="slide.configureUrl" target="_blank" rel="noopener noreferrer">
                                        {{ translations.carousel.buttons.configureLabel }}
                                    </a>
                                </button>
                                <button v-if="slide.offersFormUrl" class="bg-white rounded-full w-full py-3 font-PeugeotNewBold text-[10px] text-blue">
                                    <a :href="slide.offersFormUrl" target="_blank" rel="noopener noreferrer">
                                        {{ translations.carousel.buttons.offersLabel }}
                                    </a>
                                </button>
                                <button v-if="slide.testDriveUrl" class="bg-white rounded-full w-full py-3 font-PeugeotNewBold text-[10px] text-blue">
                                    <a :href="slide.testDriveUrl" target="_blank" rel="noopener noreferrer">
                                        {{ translations.carousel.buttons.testDriveLabel }}
                                    </a>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                </swiper-slide>
            </swiper-container>

    </div>
</template>

<style>
/* swiper-container::part(pagination) {
    @apply w-24
} */
swiper-container::part(bullet) {
    @apply bg-white opacity-100
}
/* swiper-container::part(bullet-active) {
    @apply w-6 rounded-2xl
} */
swiper-container::part(button-prev) {
    @apply text-gray-dark rounded-full w-6 h-6 p-2 ml-2 bg-white -mt-12
}
swiper-container::part(button-next) {
    @apply text-gray-dark rounded-full w-6 h-6 p-2 mr-2 bg-white -mt-12
}
</style>


