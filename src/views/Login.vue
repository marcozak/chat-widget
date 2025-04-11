<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { login, isAuthenticated } from '@/utils/auth'

// Icons and components
import GeniusIcon from '@/components/GeniusIcon.vue'

// Router for navigation
const router = useRouter()

// Form state
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

// Input validation
const isEmailValid = computed(() => {
  return email.value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
})

const isPasswordValid = computed(() => {
  return password.value === '' || password.value.length >= 6
})

const isFormValid = computed(() => {
  return isEmailValid.value && isPasswordValid.value && email.value !== '' && password.value !== ''
})

// Check if already authenticated and redirect if needed
if (isAuthenticated()) {
  router.push('/chat')
}

// Handle login submission
const handleLogin = async () => {
  if (!isFormValid.value) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    await login(email.value, password.value, rememberMe.value)
    router.push('/chat')
  } catch (error) {
    if (error.status === 401) {
      errorMessage.value = 'Invalid email or password'
    } else {
      errorMessage.value = 'An error occurred. Please try again.'
    }
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-dark p-4">
    <div class="w-full max-w-md px-6 py-8 bg-gray-dark rounded-lg shadow-md">
      <!-- Logo -->
      <div class="flex justify-center mb-6">
        <GeniusIcon class="w-16 h-16" />
      </div>
      
      <!-- Title -->
      <h1 class="text-xl text-white font-PeugeotNewBold text-center mb-8">Sign in to your account</h1>
      
      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Email input -->
        <div>
          <label for="email" class="block text-sm font-PeugeotNew text-gray mb-1">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full px-3 py-2 bg-blue-gray rounded-md border border-gray-600 text-white text-sm"
            :class="{ 'border-red-500': !isEmailValid }"
          />
          <p v-if="!isEmailValid" class="mt-1 text-xs text-red-500">Please enter a valid email address</p>
        </div>
        
        <!-- Password input -->
        <div>
          <label for="password" class="block text-sm font-PeugeotNew text-gray mb-1">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-3 py-2 bg-blue-gray rounded-md border border-gray-600 text-white text-sm"
            :class="{ 'border-red-500': !isPasswordValid }"
          />
          <p v-if="!isPasswordValid" class="mt-1 text-xs text-red-500">Password must be at least 6 characters</p>
        </div>
        
        <!-- Remember me checkbox -->
        <div class="flex items-center">
          <input
            id="remember-me"
            v-model="rememberMe"
            type="checkbox"
            class="h-4 w-4 bg-blue-gray border-gray-600 rounded"
          />
          <label for="remember-me" class="ml-2 block text-sm text-gray">Remember me</label>
        </div>
        
        <!-- Error message -->
        <div v-if="errorMessage" class="px-4 py-2 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-100 text-sm">
          {{ errorMessage }}
        </div>
        
        <!-- Submit button -->
        <div>
          <button
            type="submit"
            :disabled="!isFormValid || isLoading"
            class="w-full py-3 px-4 rounded-md bg-blue text-white font-PeugeotNewBold"
            :class="{ 'opacity-50 cursor-not-allowed': !isFormValid || isLoading }"
          >
            <span v-if="isLoading">Signing in...</span>
            <span v-else>Sign in</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>