<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Gestión de Clientes</h2>

    <form @submit.prevent="crearCliente" class="flex flex-col md:flex-row gap-2 mb-4">
      <input v-model="nuevo.nombre" type="text" placeholder="Nombre" required class="input" />
      <input v-model="nuevo.numero" type="number" placeholder="Número único" required class="input" />
      <button class="btn-primary">Agregar</button>
    </form>

    <input v-model="busqueda" @input="obtenerClientes" type="text" placeholder="Buscar por nombre" class="input mb-4 w-full" />

    <div v-if="error" class="text-red-500 mb-2">{{ error }}</div>

    <table class="w-full border shadow rounded overflow-hidden text-sm">
      <thead class="bg-gray-100 text-left">
        <tr>
          <th class="p-2">Nombre</th>
          <th class="p-2">Número</th>
          <th class="p-2 text-right">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cliente in clientes" :key="cliente.id" class="border-t">
          <td class="p-2">{{ cliente.nombre }}</td>
          <td class="p-2">{{ cliente.numero }}</td>
          <td class="p-2 text-right">
            <button class="text-blue-500 mr-2" @click="editar(cliente)">Editar</button>
            <button class="text-red-500" @click="eliminar(cliente.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-between items-center mt-4">
      <button class="btn-secondary" @click="anterior" :disabled="pagina === 1">Anterior</button>
      <span>Página {{ pagina }}</span>
      <button class="btn-secondary" @click="siguiente" :disabled="clientes.length < 10">Siguiente</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const clientes = ref([])
const nuevo = ref({ nombre: '', numero: '' })
const pagina = ref(1)
const busqueda = ref('')
const error = ref(null)

const obtenerClientes = async () => {
  try {
    const res = await axios.get(`/clientes?page=${pagina.value}&search=${busqueda.value}`)
    clientes.value = res.data.data
  } catch (e) {
    error.value = 'Error al obtener clientes'
  }
}

const crearCliente = async () => {
  try {
    await axios.post('/clientes', nuevo.value)
    nuevo.value = { nombre: '', numero: '' }
    obtenerClientes()
  } catch (e) {
    error.value = e.response?.data?.error || 'Error al crear cliente'
  }
}

const eliminar = async (id) => {
  await axios.delete(`/clientes/${id}`)
  obtenerClientes()
}

const editar = async (cliente) => {
  const nombre = prompt('Nuevo nombre', cliente.nombre)
  const numero = prompt('Nuevo número', cliente.numero)
  if (!nombre || !numero) return
  await axios.put(`/clientes/${cliente.id}`, { nombre, numero })
  obtenerClientes()
}

const siguiente = () => {
  pagina.value++
  obtenerClientes()
}

const anterior = () => {
  if (pagina.value > 1) {
    pagina.value--
    obtenerClientes()
  }
}

onMounted(obtenerClientes)
</script>

<style scoped>
.input {
  @apply border px-3 py-2 rounded w-full;
}
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700;
}
.btn-secondary {
  @apply bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300;
}
</style>