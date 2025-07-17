import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'

// Configura la URL base de Axios para que apunte a la API del backend.
// Utiliza la variable de entorno de Vite, que configurarás en Netlify.
axios.defaults.baseURL = `${import.meta.env.VITE_APP_BACKEND_URL}/api`;

createApp(App).mount('#app')
