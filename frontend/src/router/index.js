import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Records from '../views/Records.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/records',
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/records',
      name: 'Records',
      component: Records,
      meta: { requiresAuth: true },
    },
  ],
})

// verificar autenticacion antes de cada ruta
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  console.log('navegando a:', to.path) // debugging
  console.log('esta autenticado?', authStore.isAuthenticated)
  
  if(to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('no autenticado, redirigiendo a login')
    next('/login')
  } else if(to.path === '/login' && authStore.isAuthenticated) {
    console.log('ya autenticado, redirigiendo a records')
    next('/records')
  } else {
    next()
  }
})

export default router