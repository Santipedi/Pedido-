const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Obtener clientes con búsqueda y paginación
router.get('/', async (req, res) => {
  const { page = 1, search = '' } = req.query;
  const pageSize = 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const query = supabase
    .from('clientes')
    .select('*', { count: 'exact' })
    .ilike('nombre', `%${search}%`)
    .order('id', { ascending: false })
    .range(from, to);

  const { data, count, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data, total: count });
});

// Agregar cliente (validación de número único)
router.post('/', async (req, res) => {
  const { nombre, numero, id_usuario = null } = req.body;
  const { data: existentes } = await supabase.from('clientes').select('id').eq('numero', numero);
  if (existentes.length > 0) {
    return res.status(400).json({ error: 'Ya existe un cliente con ese número' });
  }
  const { data, error } = await supabase.from('clientes').insert([{ nombre, numero, id_usuario }]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Actualizar cliente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, numero } = req.body;

  const { data: existentes } = await supabase
    .from('clientes')
    .select('id')
    .eq('numero', numero)
    .neq('id', id);
  if (existentes.length > 0) {
    return res.status(400).json({ error: 'Otro cliente ya tiene ese número' });
  }
  const { data, error } = await supabase.from('clientes').update({ nombre, numero }).eq('id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// Eliminar cliente
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('clientes').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;