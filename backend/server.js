require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Importar cors
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// Configurar CORS para permitir peticiones desde tu frontend de Netlify
// En producción, deberías restringir esto a la URL de tu frontend de Netlify
app.use(cors({
    origin: 'https://wonderful-licorice-ea1cef.netlify.app'
})); // Configurar CORS para permitir solo tu frontend de Netlify

app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Las variables de entorno SUPABASE_URL o SUPABASE_KEY no están definidas.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de Pedidos con Express y Supabase funcionando!');
});

// Nueva ruta para el "ping/pong"
app.get('/ping', (req, res) => {
    res.send('pong');
});

// Rutas para Clientes
const clientesRouter = require('./clientes.js');
app.use('/api/clientes', clientesRouter);

// Ejemplo de ruta para obtener datos de Supabase
app.get('/items', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('items')
            .select('*');

        if (error) {
            throw error;
        }
        res.status(200).json(data);
    } catch (error) {
        console.error('Error al obtener items:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.listen(port, () => {
    console.log(`Servidor Express escuchando en http://localhost:${port}`);
});
