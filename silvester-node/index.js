const express = require('express');
const cors = require('cors');
const orionService = require('./orion-service');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/', async (req, res) => {
  try {
    const entity = req.body;
    const result = await orionService.createEntity(entity);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Could not create entity' });
  }
});

// Orion route
app.get('/', async (req, res) => {
  try {
    const result = await orionService.getEntities();
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Could not get entity' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});