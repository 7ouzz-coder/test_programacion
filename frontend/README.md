# Frontend - Vue 3 + Vuetify 3

## 📋 Objetivo

Crear una aplicación web en Vue 3 con Vuetify 3 que:
1. Permita login con JWT
2. Muestre una tabla de records
3. Permita crear/editar records
4. Tenga una interfaz con sidebar, toolbar y main section

## 🚀 Setup Inicial

### 1. Crear Proyecto Vue 3
### 2. Instalar Vuetify 3

Sigue la guía oficial: https://vuetifyjs.com/en/getting-started/installation/

## ✅ Pantallas a Implementar

### 1. Login (`/login`)

- Formulario con campos:
  - Email (text field)
  - Password (password field)
- Botón "Iniciar Sesión"
- Al hacer login:
  - Guardar token en localStorage
  - Redirigir a `/records`
- Mostrar errores si las credenciales son inválidas

### 2. Records (`/records`)

- **Tabla Vuetify**

### 3. Layout Base

- AppBar con:
  - Título
  - Email del usuario logueado
  - Botón "Cerrar Sesión"
- Navigation drawer

## 🔐 Autenticación

### Store de Auth (`stores/auth.ts`)


## 🌐 Cliente API

Debes usar Axios. Crea `src/services/api.ts` con:
- Configuración de baseURL
- Interceptor para agregar token JWT en headers
- Interceptor para manejar errores 401 (redirigir a login)

## 📱 Responsive

- Usa el sistema de grid de Vuetify (`v-row`, `v-col`)
- La tabla debe ser responsive (scroll horizontal en móviles o cards)

**¡Sigue la guía de instalación de Vuetify 3 y empieza con el login!**

