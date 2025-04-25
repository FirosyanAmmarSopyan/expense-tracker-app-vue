import { createRouter as createVueRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { setupLayouts } from 'virtual:generated-layouts'
import { useGlobalStore } from '@/stores/global'

// Fungsi untuk membuat router
export function createRouter(app) {
  const router = createVueRouter({
    history: createWebHistory(),
    routes: [
      ...setupLayouts([
        ...routes,
        {
          path: '/login',
          name: 'login',
          component: () => import('../views/LoginView.vue'),
          meta: { requiresAuth: false }
        },
        {
          path: '/',
          name: 'home',
          component: () => import('../views/HomeView.vue'),
          meta: { requiresAuth: true }
        }
      ])
    ]
  })

  // Navigation guard
  router.beforeEach(async (to, from, next) => {
    const isAuthenticated = localStorage.getItem('access_token')
    const globalStore = useGlobalStore()
    
    console.log('Auth check:', { 
      path: to.path, 
      requiresAuth: to.meta.requiresAuth, 
      isAuthenticated: !!isAuthenticated 
    })
    
    // Cek untuk first-time page load
    if (to.path === '/' && !isAuthenticated) {
      console.log('First-time page load - redirecting to login')
      next('/login')
      return
    }
    
    // Jika mencoba akses halaman yang membutuhkan auth
    if (to.meta.requiresAuth === true) {
      if (!isAuthenticated) {
        console.log('Redirecting to login - requires auth but not authenticated')
        next('/login')
        return
      }
      
      try {
        await globalStore.fetchUserData(isAuthenticated)
        console.log('Token is valid - allowing access')
        next()
      } catch (error) {
        console.log('Token validation failed:', error)
        // Clear token and redirect to login
        localStorage.removeItem('access_token')
        next('/login')
        return
      }
    }
    else if (to.path === '/login' && isAuthenticated) {
      try {
        await globalStore.fetchUserData(isAuthenticated)
        console.log('Token is valid - redirecting to home')
        next('/')
      } catch (error) {
        console.log('Token validation failed:', error)
        // Clear token and stay on login page
        localStorage.removeItem('access_token')
        next()
      }
    }
    else {
      console.log('Allowing access - page does not require auth')
      next()
    }
  })

  return router
}
