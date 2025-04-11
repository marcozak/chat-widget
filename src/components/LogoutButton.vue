<script setup>
import { ref } from 'vue'
import { logout } from '@/utils/auth'

const isLoggingOut = ref(false)

const handleLogout = async () => {
  if (isLoggingOut.value) return
  
  isLoggingOut.value = true
  try {
    await logout()
    // Redirect happens in the logout function
  } catch (error) {
    console.error('Error during logout:', error)
    // Still redirect even if server-side logout fails
    window.location.href = '/login'
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<template>
  <button 
    @click="handleLogout" 
    :disabled="isLoggingOut"
    class="px-3 py-1.5 bg-blue-gray rounded-md text-white text-xs font-PeugeotNew hover:bg-opacity-80 transition-colors"
    :class="{ 'opacity-50 cursor-not-allowed': isLoggingOut }"
  >
    <span v-if="isLoggingOut">Logging out...</span>
    <span v-else>Log Out</span>
  </button>
</template>