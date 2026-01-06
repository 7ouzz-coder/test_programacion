<template>
  <v-dialog :model-value="modelValue" @update:model-value="close" max-width="600">
    <v-card>
      <v-card-title>
        {{ isEdit ? 'Editar Record' : 'Nuevo Record' }}
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="saveRecord">
          <v-text-field
            v-model="form.sourceId"
            label="Source ID"
            variant="outlined"
            :disabled="isEdit"
            :rules="[v => !!v || 'Requerido']"
          ></v-text-field>

          <v-text-field
            v-model="form.date"
            label="Fecha"
            type="date"
            variant="outlined"
            :rules="[v => !!v || 'Requerido']"
          ></v-text-field>

          <v-select
            v-model="form.category"
            :items="categories"
            label="Categoría"
            variant="outlined"
            :rules="[v => !!v || 'Requerido']"
          ></v-select>

          <v-text-field
            v-model="form.amount"
            label="Monto"
            type="number"
            step="0.01"
            variant="outlined"
            :rules="[v => !!v || 'Requerido']"
          ></v-text-field>

          <v-select
            v-model="form.status"
            :items="statuses"
            label="Estado"
            variant="outlined"
            :rules="[v => !!v || 'Requerido']"
          ></v-select>

          <v-textarea
            v-model="form.description"
            label="Descripción"
            variant="outlined"
            rows="3"
          ></v-textarea>

          <!-- mostrar error -->
          <v-alert v-if="error" type="error" class="mb-4">
            {{ error }}
          </v-alert>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close" :disabled="saving">
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          @click="saveRecord"
          :loading="saving"
        >
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, watch, computed } from 'vue'
import api from '../services/api'

export default {
  name: 'RecordDialog',

  props: {
    modelValue: Boolean,
    record: Object,
  },

  emits: ['update:modelValue', 'saved'],

  setup(props, { emit }) {
    // variables
    const saving = ref(false)
    const error = ref(null)
    
    const form = ref({
      sourceId: '',
      date: '',
      category: '',
      amount: '',
      status: '',
      description: '',
    })

    // opciones
    const categories = ['Ventas', 'Gastos', 'Inventario']
    const statuses = ['activo', 'pendiente', 'completado', 'cancelado']

    // es edicion?
    const isEdit = computed(() => !!props.record)

    // cargar datos del record si es edicion
    watch(() => props.record, (newRecord) => {
      if(newRecord) {
        console.log('cargando record para editar:', newRecord)
        form.value = {
          sourceId: newRecord.sourceId || '',
          date: newRecord.date ? newRecord.date.split('T')[0] : '',
          category: newRecord.category || '',
          amount: newRecord.amount || '',
          status: newRecord.status || '',
          description: newRecord.description || '',
        }
      } else {
        // limpiar form
        form.value = {
          sourceId: '',
          date: '',
          category: '',
          amount: '',
          status: '',
          description: '',
        }
      }
    }, { immediate: true })

    // cerrar dialog
    const close = () => {
      emit('update:modelValue', false)
    }

    // guardar record
    const saveRecord = async () => {
      console.log('guardando record...', form.value) // debugging
      
      // validar campos requeridos
      if(!form.value.sourceId || !form.value.date || !form.value.category || 
         !form.value.amount || !form.value.status) {
        error.value = 'Por favor completa todos los campos requeridos'
        return
      }

      saving.value = true
      error.value = null

      try {
        const data = {
          sourceId: form.value.sourceId,
          date: form.value.date,
          category: form.value.category,
          amount: parseFloat(form.value.amount),
          status: form.value.status,
          description: form.value.description || '',
        }

        console.log('data a enviar:', data)

        if(isEdit.value) {
          // actualizar
          console.log('actualizando record id:', props.record.id)
          await api.put(`/records/${props.record.id}`, data)
        } else {
          // crear
          console.log('creando nuevo record')
          await api.post('/records', data)
        }

        console.log('guardado exitoso!')
        emit('saved')
        close()
      } catch (error) {
        console.error('error guardando:', error)
        error.value = error.response?.data?.error || 'Error al guardar'
      } finally {
        saving.value = false
      }
    }

    return {
      form,
      saving,
      error,
      categories,
      statuses,
      isEdit,
      close,
      saveRecord,
    }
  },
}
</script>