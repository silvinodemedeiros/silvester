const express = require('express');
const cors = require('cors');
const weatherService = require('./weather.service');

const app = express();
const PORT = 3100;

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const result = await weatherService.getLocalWeather();
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Could not get entity' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});