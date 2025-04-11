<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { isAuthenticated } from '@/utils/auth'
import ChatWindow from '@/components/ChatWindow.vue'

const router = useRouter()

// Check authentication on component mount
onMounted(() => {
  if (!isAuthenticated()) {
    router.push('/login')
  }
})
</script>

<template>
  <div>
    <div class="flex items-center justify-center h-screen flex-col">
      <p class="font-PeugeotNewBold text-3xl">Electric Genius</p>
      <img src="/images/PeugeotIconDark.png" alt="Peugeot Icon Dark" class="w-80 md:w-96">
    </div>
    <ChatWindow />
  </div>
</template>