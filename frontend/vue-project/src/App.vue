<script setup>
import { ref, onMounted } from 'vue';

const backendResponse = ref('Cargando...');

onMounted(async () => {
  try {
    // La URL del backend se obtendrá de la variable de entorno
    // En Netlify, configurar VITE_APP_BACKEND_URL
    const backendUrl = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:3000';
    const response = await fetch(`${backendUrl}/ping`);
    const data = await response.text();
    backendResponse.value = `Backend dice: ${data}`;
  } catch (error) {
    console.error('Error al conectar con el backend:', error);
    backendResponse.value = 'Error al conectar con el backend.';
  }
});
</script>

<template>
  <header>
    <h1>Frontend de Pedidos</h1>
    <p>{{ backendResponse }}</p>
  </header>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>