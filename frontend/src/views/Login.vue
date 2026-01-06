<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-card-title class="text-center">
                <h2>Iniciar Sesión</h2>
              </v-card-title>

              <v-card-text>
                <v-form @submit.prevent="handleLogin">
                  <v-text-field
                    v-model="email"
                    label="Email"
                    type="email"
                    prepend-inner-icon="mdi-email"
                    variant="outlined"
                    :disabled="loading"
                  ></v-text-field>

                  <v-text-field
                    v-model="password"
                    label="Contraseña"
                    :type="showPassword ? 'text' : 'password'"
                    prepend-inner-icon="mdi-lock"
                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showPassword = !showPassword"
                    variant="outlined"
                    :disabled="loading"
                  ></v-text-field>

                  <!-- mostrar error si hay -->
                  <v-alert
                    v-if="error"
                    type="error"
                    class="mb-4"
                    closable
                    @click:close="error = null"
                  >
                    {{ error }}
                  </v-alert>

                  <v-btn
                    type="submit"
                    color="primary"
                    block
                    size="large"
                    :loading="loading"
                  >
                    Iniciar Sesión
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Login',
  
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    // variables
    const email = ref('')
    const password = ref('')
    const showPassword = ref(false)
    const loading = ref(false)
    const error = ref(null)

    // funcion para hacer login
    const handleLogin = async () => {
      console.log('intentando login con:', email.value) // debugging
      
      // validaciones basicas
      if(!email.value || !password.value) {
        error.value = 'Por favor completa todos los campos'
        return
      }

      loading.value = true
      error.value = null

      // llamar al store
      const result = await authStore.login(email.value, password.value)

      loading.value = false

      if(result.success) {
        console.log('login exitoso, redirigiendo...')
        router.push('/records')
      } else {
        console.log('login fallido:', result.error)
        error.value = result.error || 'Error al iniciar sesión'
      }
    }

    return {
      email,
      password,
      showPassword,
      loading,
      error,
      handleLogin,
    }
  },
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>