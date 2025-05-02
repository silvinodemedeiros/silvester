const express = require('express');
const axios = require('axios');
const cors = require('cors');

const orionService = require('./orion.service');
const weatherService = require('../weather/weather.service');
const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

// creates orion entity
app.post('/', async (req, res) => {
  try {
    const entity = req.body;
    const result = await orionService.createEntity(entity);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Could not create entity' });
  }
});

// get all orion entities
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

  weatherService.getLocalWeather().then((localWeather) => {;

    const orionEntity = weatherService.generateOrionEntity(localWeather);

    orionService.createEntity(orionEntity).then((result) => {
      console.log(result);
    }, error => console.log(error.response?.status, error.response?.data));
  });
});