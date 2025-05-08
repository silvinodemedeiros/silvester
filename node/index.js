const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const orionService = require('./orion.service');
const weatherService = require('../weather/weather.service');
const app = express();

const PORT = 3000;

app.use(cors());
// app.use(express.json());
app.use(bodyParser.json());

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

// Store connected clients
const clients = [];

// Endpoint for Angular to listen to events
app.get('/events', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.flushHeaders();

  // Push client to list
  clients.push(res);

  // Remove client on disconnect
  req.on('close', () => {
    const index = clients.indexOf(res);
    if (index !== -1) clients.splice(index, 1);
  });
});

// get orion POST notification from subscription
app.post('/notify', async (req, res) => {
  try {
    console.log('Received notification from Orion:');
    console.log(JSON.stringify(req.body, null, 2));

    // Send to all connected Angular clients
    clients.forEach(client => {
      client.write(`data: ${JSON.stringify(req.body)}\n\n`);
    });
  
    // Always respond with HTTP 204 (No Content)
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Could not create entity' });
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