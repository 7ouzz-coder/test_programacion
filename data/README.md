# Data - Archivo PDF y Estructura de Datos

## 📄 Archivo PDF

En esta carpeta encontrarás `data.pdf` que contiene datos estructurados que debes extraer y cargar a la base de datos.

## 📋 Estructura de Datos Esperada

Después de extraer y normalizar el PDF, los datos deben tener la siguiente estructura:

### Campos Requeridos

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `sourceId` | String | Identificador único del registro en el PDF | "PDF-001", "INV-2024-001" |
| `date` | Date (YYYY-MM-DD) | Fecha del registro | "2024-01-15" |
| `category` | String | Categoría del registro | "Ventas", "Gastos", "Inventario" |
| `amount` | Decimal | Monto numérico | 1500.50 |
| `status` | String | Estado del registro | "activo", "pendiente", "completado" |
| `description` | String (opcional) | Descripción adicional | "Venta de producto X" |

### Reglas de Normalización

1. **sourceId**: 
   - Debe ser único
   - Se usa como clave para upsert (idempotencia)
   - Si el PDF no tiene un ID claro, genera uno basado en posición o contenido

2. **date**:
   - Normalizar a formato `YYYY-MM-DD`
   - Manejar diferentes formatos del PDF (DD/MM/YYYY, MM-DD-YYYY, etc.)
   - Si no hay fecha, usar fecha actual

3. **amount**:
   - Convertir a número decimal
   - Remover símbolos de moneda ($, €, etc.)
   - Remover separadores de miles (comas)
   - Manejar negativos si aplica

4. **category**:
   - Normalizar a valores consistentes (mayúsculas/minúsculas)
   - Mapear variaciones a valores estándar

5. **status**:
   - Normalizar a valores estándar (lowercase recomendado)
   - Valores comunes: "activo", "pendiente", "completado", "cancelado"

## 🔄 Flujo de Procesamiento

```
data.pdf
    ↓
[Extract] → raw.json / raw.csv (formato libre, datos crudos)
    ↓
[Normalize] → normalized.json / normalized.csv (formato estándar)
    ↓
[Load] → MySQL (tabla `records`, upsert por sourceId)
```

## 📝 Archivos Generados

Durante el proceso de ingesta, se generarán (temporalmente):

- `raw.json` - Datos extraídos del PDF (formato libre)
- `raw.csv` - Mismo contenido en CSV
- `normalized.json` - Datos normalizados (formato estándar)
- `normalized.csv` - Mismo contenido en CSV

**Nota**: Estos archivos pueden ser temporales o guardarse para auditoría. Decide según tu implementación.

## 🧪 Datos de Prueba

Si necesitas probar sin el PDF real, puedes crear un `normalized.example.csv` con datos de ejemplo:

```csv
sourceId,date,category,amount,status,description
TEST-001,2024-01-15,Ventas,1500.50,activo,Venta de producto A
TEST-002,2024-01-16,Gastos,250.75,completado,Pago de servicios
TEST-003,2024-01-17,Inventario,5000.00,pendiente,Stock inicial
```

## ⚠️ Consideraciones

- El PDF puede tener diferentes estructuras (tablas, texto libre, formularios)
- Puede requerir OCR si es un PDF escaneado
- Algunos campos pueden estar vacíos o en formatos inconsistentes
- Implementa validación robusta y manejo de errores

## 📚 Referencias

- El backend debe leer este PDF desde `../data/data.pdf` (ruta relativa desde la carpeta backend)
- Los campos deben mapearse según la estructura de la tabla `records` en MySQL

---

**¡Analiza el PDF y define tu estrategia de extracción!**

