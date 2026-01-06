import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isLoading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    // inicializar desde localStorage
    init() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      
      if(token && user) {
        this.token = token
        this.user = JSON.parse(user)
        console.log('usuario cargado desde localStorage')
      }
    },

    // login
    async login(email, password) {
      this.isLoading = true
      
      try {
        console.log('intentando login...') // debugging
        
        const response = await api.post('/auth/login', {
          email,
          password,
        })

        console.log('respuesta login:', response.data)

        if(response.data.token) {
          // guardar token y usuario
          this.token = response.data.token
          this.user = response.data.user
          
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('user', JSON.stringify(response.data.user))
          
          console.log('login exitoso!')
          return { success: true }
        } else {
          return { success: false, error: response.data.error }
        }
      } catch (error) {
        console.error('error en login:', error)
        return { 
          success: false, 
          error: error.response?.data?.error || 'Error al iniciar sesión' 
        }
      } finally {
        this.isLoading = false
      }
    },

    // registro
    async register(email, password) {
      this.isLoading = true
      
      try {
        const response = await api.post('/auth/register', {
          email,
          password,
        })

        if(response.data.token) {
          this.token = response.data.token
          this.user = response.data.user
          
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('user', JSON.stringify(response.data.user))
          
          return { success: true }
        } else {
          return { success: false, error: response.data.error }
        }
      } catch (error) {
        return { 
          success: false, 
          error: error.response?.data?.error || 'Error al registrar' 
        }
      } finally {
        this.isLoading = false
      }
    },

    // logout
    logout() {
      console.log('cerrando sesion...')
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})