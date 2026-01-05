# Prueba Técnica -

## 📋 Descripción del Desafío

Este repositorio contiene un proyecto base para implementar un **pipeline completo de ingesta de datos** desde un PDF hacia una base de datos MySQL, con una API REST en NestJS y una interfaz web en Vue 3 + Vuetify 3, terminando de mostrar los datos en un PowerBI con una conexión directa desde la base de datos.

### Objetivo Principal

El candidato debe implementar un sistema que:
1. **Extraiga** datos estructurados desde un archivo PDF (`/data/data.pdf`)
2. **Normalice** los datos extraídos hacia un formato estándar
3. **Cargue** los datos normalizados en MySQL de forma idempotente
4. **Exponga** una API REST con autenticación JWT
5. **Muestre** los datos en una interfaz web con Vue 3 + Vuetify 3
6. **Cree** un dashboard en PowerBI

## 🏗️ Estructura del Proyecto

```
practica_test/
├── backend/          # API NestJS - Debes crear el proyecto desde cero
├── frontend/         # App Vue 3 + Vuetify 3 - Debes crear el proyecto desde cero
├── data/             # Dataset PDF y documentación
```

## 🚀 Inicio Rápido

### Prerrequisitos
- **Laragon** instalado y funcionando (incluye Node.js y MySQL)
- Node.js (viene con Laragon)
- MySQL (viene con Laragon)
- pnpm o npm

### Pasos Generales

1. **Revisa cada carpeta**: Cada carpeta (`/backend`, `/frontend`, `/data`) tiene su propio README con instrucciones específicas.

2. **Empieza por el backend**: Sigue las instrucciones en `/backend/README.md`

3. **Luego el frontend**: Sigue las instrucciones en `/frontend/README.md`

4. **Usa los datos de ejemplo**: Revisa `/data/README.md` para entender la estructura esperada

5. **Crea el dashboard PowerBI**: Crear visualizaciones

## 📊 PowerBI Dashboard

Como parte final del proyecto, debes crear un dashboard en PowerBI Desktop que:

1. **Conecte directamente a MySQL** usando el conector nativo de MySQL
2. **Importe los datos** de la tabla `records`
3. **Crea visualizaciones** como:
   - Gráfico de montos por categoría
   - Tabla de registros con filtros
   - Gráfico de tendencias por fecha
   - Métricas agregadas (total, promedio, etc.)


## 📚 Documentación

- **[Backend README](./backend/README.md)** - Instrucciones para crear la API NestJS
- **[Frontend README](./frontend/README.md)** - Instrucciones para crear la app Vue 3 + Vuetify 3
- **[Data README](./data/README.md)** - Información sobre el PDF y estructura de datos

## ✅ Qué Entregar

1. **Repositorio Git** con git commit de todo el código realizado hasta las 17hrs del 06-01-2026
2. **Dashboard PowerBI** con visualizaciones de los datos

## 🛠️ Stack Tecnológico

- **Backend**: NestJS, TypeScript, MySQL, JWT
- **Frontend**: Vue 3, Vuetify 3, Pinia, Axios
- **Base de Datos**: MySQL
- **BI**: PowerBI Desktop

## 📞 Notas Importantes

- **NO** hay código base implementado. Debes crear todo desde cero siguiendo los READMEs.
- Cada carpeta tiene instrucciones específicas sobre qué implementar.
- Usa Laragon para gestionar MySQL y Node.js.

---

**¡Buena suerte!🚀**
