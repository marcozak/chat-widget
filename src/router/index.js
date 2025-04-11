// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/utils/auth'

// Import views
import HomeView from '@/views/HomeView.vue'
import Login from '@/views/Login.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
 {
   path: '/login',
   name: 'Login',
   component: Login,
   meta: { requiresGuest: true }
 },
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
    //meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Authentication navigation guard
router.beforeEach((to, from, next) => {
  const authenticated = isAuthenticated()
  
  // Routes that require authentication
  if (to.meta.requiresAuth && !authenticated) {
    return next({ name: 'Login' })
  }
  
  // Routes that require guest (non-authenticated)
  if (to.meta.requiresGuest && authenticated) {
    return next({ name: 'Home' })
  }
  
  next()
})

export default router