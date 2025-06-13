const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const app = express();
const PORT = 3000;

// Carrega o arquivo YAML do Swagger
const swaggerDocument = YAML.load('./swagger.yaml');

app.use(express.json());
app.use(express.static('public'));

let dados = [
  { id: 1, message: 'Primeira mensagem' },
  { id: 2, message: 'Segunda mensagem' }
];

// GET (listar todos ou buscar por ID via query)
app.get('/api/data', (req, res) => {
  const id = req.query.id;
  if (id) {
    const item = dados.find(d => d.id == id);
    if (!item) return res.status(404).json({ error: 'ID não encontrado' });
    return res.json(item);
  }
  res.json(dados);
});

// POST (igual, não precisa de id na query)
app.post('/api/data', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Campo "message" é obrigatório' });
  const novo = {
    id: dados.length ? Math.max(...dados.map(d => d.id)) + 1 : 1,
    message
  };
  dados.push(novo);
  res.status(201).json(novo);
});

// PUT (id na query)
app.put('/api/data', (req, res) => {
  const id = req.query.id;
  const { message } = req.body;
  if (!id) return res.status(400).json({ error: 'ID na query é obrigatório' });
  const idx = dados.findIndex(d => d.id == id);
  if (idx === -1) return res.status(404).json({ error: 'ID não encontrado' });
  if (!message) return res.status(400).json({ error: 'Campo "message" é obrigatório' });
  dados[idx].message = message;
  res.json(dados[idx]);
});

// PATCH (id na query)
app.patch('/api/data', (req, res) => {
  const id = req.query.id;
  const { message } = req.body;
  if (!id) return res.status(400).json({ error: 'ID na query é obrigatório' });
  const item = dados.find(d => d.id == id);
  if (!item) return res.status(404).json({ error: 'ID não encontrado' });
  if (!message) return res.status(400).json({ error: 'Campo "message" é obrigatório' });
  item.message += ' ' + message;
  res.json(item);
});

// DELETE (id na query)
app.delete('/api/data', (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: 'ID na query é obrigatório' });
  const idx = dados.findIndex(d => d.id == id);
  if (idx === -1) return res.status(404).json({ error: 'ID não encontrado' });
  dados.splice(idx, 1);
  res.sendStatus(204);
});

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 404 genérico
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Sobe o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log('Swagger docs em http://localhost:3000/api-docs');
});

