<template>
  <v-app>
    <!-- app bar -->
    <v-app-bar v-if="isAuthenticated" color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      
      <v-toolbar-title>Sistema de Records</v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- info del usuario -->
      <span class="mr-4">{{ userEmail }}</span>

      <!-- boton logout -->
      <v-btn icon @click="handleLogout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- navigation drawer -->
    <v-navigation-drawer
      v-if="isAuthenticated"
      v-model="drawer"
      temporary
    >
      <v-list>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Records"
          @click="$router.push('/records')"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- contenido principal -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

export default {
  name: 'App',

  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const drawer = ref(false)

    // computed
    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const userEmail = computed(() => authStore.user?.email || '')

    // logout
    const handleLogout = () => {
      console.log('cerrando sesion...')
      authStore.logout()
      router.push('/login')
    }

    return {
      drawer,
      isAuthenticated,
      userEmail,
      handleLogout,
    }
  },
}
</script>

<style>

</style>