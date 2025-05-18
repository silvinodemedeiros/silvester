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

// get all orion entities
app.get('/entities', async (req, res) => {
  try {
    const result = await orionService.getEntities();
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Could not get entity' });
  }
});

// creates orion entity
app.patch('/entities/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await orionService.updateEntity(req.body, id);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Could not create entity' });
  }
});

// get all orion subscriptions
app.get('/subscriptions', async (req, res) => {
  try {
    const result = await orionService.getSubscriptions();
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Could not get entity' });
  }
});

// updates orion subscriptions
app.patch('/subscriptions/update/:subscriptionId', async (req, res) => {
  try {
    const id = req.params.subscriptionId;
    const subscription = req.body;
    const result = await orionService.updateSubscription(id, subscription);
    res.status(201).json(result);
  } catch (err) {
    const {status, message, stack, code} = err;
    res.status(500).json({status, message, stack, code});
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