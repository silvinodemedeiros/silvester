const axios = require('axios');

const ORION_URL = 'http://localhost:1026/v2';

async function getEntities() {
  try {
    const response = await axios.get(`${ORION_URL}/entities`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function createEntity(entity) {
  try {
    const response = await axios.post(`${ORION_URL}/entities`, entity, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function getSubscriptions() {
  try {
    const response = await axios.get(`${ORION_URL}/subscriptions`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function updateSubscription(subscriptionId, subscription) {
  try {
    const response = await axios.patch(`${ORION_URL}/subscriptions/${subscriptionId}`, subscription, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createEntity,
  getSubscriptions,
  updateSubscription,
  getEntities,
};