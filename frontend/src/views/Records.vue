<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1>Gestión de Records</h1>
      </v-col>
    </v-row>

    <!-- filtros y acciones -->
    <v-row>
      <v-col cols="12" md="3">
        <v-text-field
          v-model="search"
          label="Buscar"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          @input="loadRecords"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="3">
        <v-select
          v-model="filterCategory"
          :items="categories"
          label="Categoría"
          variant="outlined"
          density="compact"
          clearable
          @update:model-value="loadRecords"
        ></v-select>
      </v-col>

      <v-col cols="12" md="3">
        <v-select
          v-model="filterStatus"
          :items="statuses"
          label="Estado"
          variant="outlined"
          density="compact"
          clearable
          @update:model-value="loadRecords"
        ></v-select>
      </v-col>

      <v-col cols="12" md="3" class="text-right">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="openCreateDialog"
        >
          Nuevo Record
        </v-btn>
      </v-col>
    </v-row>

    <!-- tabla de records -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="records"
              :loading="loading"
              class="elevation-1"
            >
              <!-- columna de monto -->
              <template v-slot:item.amount="{ item }">
                ${{ Number(item.amount).toFixed(2) }}
              </template>

              <!-- columna de fecha -->
              <template v-slot:item.date="{ item }">
                {{ formatDate(item.date) }}
              </template>

              <!-- columna de status con chip -->
              <template v-slot:item.status="{ item }">
                <v-chip :color="getStatusColor(item.status)" size="small">
                  {{ item.status }}
                </v-chip>
              </template>

              <!-- columna de acciones -->
              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click="openEditDialog(item)"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click="deleteRecord(item.id)"
                ></v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- dialog para crear/editar -->
    <RecordDialog
      v-model="dialog"
      :record="selectedRecord"
      @saved="onRecordSaved"
    />
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import RecordDialog from '../components/RecordDialog.vue'

export default {
  name: 'Records',
  
  components: {
    RecordDialog,
  },

  setup() {
    // variables
    const records = ref([])
    const loading = ref(false)
    const dialog = ref(false)
    const selectedRecord = ref(null)
    const search = ref('')
    const filterCategory = ref(null)
    const filterStatus = ref(null)

    // opciones para filtros
    const categories = ref(['Ventas', 'Gastos', 'Inventario'])
    const statuses = ref(['activo', 'pendiente', 'completado', 'cancelado'])

    // headers de la tabla
    const headers = [
      { title: 'ID', key: 'sourceId' },
      { title: 'Fecha', key: 'date' },
      { title: 'Categoría', key: 'category' },
      { title: 'Monto', key: 'amount' },
      { title: 'Estado', key: 'status' },
      { title: 'Descripción', key: 'description' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ]

    // cargar records desde el backend
    const loadRecords = async () => {
      loading.value = true
      console.log('cargando records...') // debugging

      try {
        // construir params
        let params = {
          page: 1,
          limit: 100,
        }

        if(search.value) params.search = search.value
        if(filterCategory.value) params.category = filterCategory.value
        if(filterStatus.value) params.status = filterStatus.value

        console.log('params:', params)

        const response = await api.get('/records', { params })
        
        console.log('records recibidos:', response.data)

        if(response.data.data) {
          records.value = response.data.data
        }
      } catch (error) {
        console.error('error cargando records:', error)
        alert('Error al cargar los records')
      } finally {
        loading.value = false
      }
    }

    // abrir dialog para crear
    const openCreateDialog = () => {
      selectedRecord.value = null
      dialog.value = true
    }

    // abrir dialog para editar
    const openEditDialog = (record) => {
      console.log('editando record:', record)
      selectedRecord.value = { ...record }
      dialog.value = true
    }

    // cuando se guarda un record
    const onRecordSaved = () => {
      dialog.value = false
      loadRecords()
    }

    // eliminar record
    const deleteRecord = async (id) => {
      if(!confirm('¿Estás seguro de eliminar este record?')) {
        return
      }

      try {
        console.log('eliminando record:', id)
        await api.delete(`/records/${id}`)
        alert('Record eliminado')
        loadRecords()
      } catch (error) {
        console.error('error eliminando:', error)
        alert('Error al eliminar')
      }
    }

    // formatear fecha
    const formatDate = (date) => {
      if(!date) return ''
      const d = new Date(date)
      return d.toLocaleDateString('es-CL')
    }

    // color del chip de status
    const getStatusColor = (status) => {
      const colors = {
        'activo': 'success',
        'pendiente': 'warning',
        'completado': 'info',
        'cancelado': 'error',
      }
      return colors[status] || 'default'
    }

    // cargar al montar
    onMounted(() => {
      console.log('componente montado, cargando records...')
      loadRecords()
    })

    return {
      records,
      loading,
      dialog,
      selectedRecord,
      search,
      filterCategory,
      filterStatus,
      categories,
      statuses,
      headers,
      loadRecords,
      openCreateDialog,
      openEditDialog,
      onRecordSaved,
      deleteRecord,
      formatDate,
      getStatusColor,
    }
  },
}
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}
</style>