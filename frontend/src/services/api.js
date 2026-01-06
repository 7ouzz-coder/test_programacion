import axios from 'axios'

// crear instancia de axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
})

// agregar token a cada request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if(token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('token agregado al request') // debugging
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// manejar errores de respuesta
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('error en api:', error) // ver errores
    
    // si el token expiró, redirigir a login
    if(error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

export default api