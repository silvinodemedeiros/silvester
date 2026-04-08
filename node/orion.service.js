const axios = require('axios');
const { Subject } = require('rxjs');
const weatherService = require('./weather/weather.service');

// const ORION_URL = 'http://localhost:1026/v2';
const ORION_URL = 'http://silvester-orion:1026/v2';

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

async function updateEntity(updateBody, entityId) {
  try {
    const requestUrl = `${ORION_URL}/entities/${entityId}/attrs`;
    const response = await axios.patch(requestUrl, updateBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating entity:', error.response?.data || error.message);
  }
}

async function removeEntity(entityId) {
  try {
    const requestUrl = `${ORION_URL}/entities/${entityId}`;
    const response = await axios.delete(requestUrl, [], {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating entity:', error.response?.data || error.message);
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

async function createSubscription(subscription) {
  try {
    const response = await axios.post(`${ORION_URL}/subscriptions`, subscription, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
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

async function generateOrionEntity(openWeatherObj) {
  let orionEntity = weatherService.generateOrionEntity(openWeatherObj);
  const entityId = orionEntity.id;
  const updateEntity_ = new Subject();

  createEntity(orionEntity).then(
    (result) => console.log(result), 
    (error) => {
      console.log(error.response?.status, error.response?.data);
      
      if (error.response?.status === 422) {
        console.log('updating entity...');
        delete orionEntity.id;
        delete orionEntity.type;
        updateEntity_.next();
      }
    }
  );

  const updateEntitySub = updateEntity_.subscribe(
    () => void updateEntity(orionEntity, entityId)
  );
}

module.exports = {
  getEntities,
  createEntity,
  updateEntity,
  removeEntity,
  getSubscriptions,
  updateSubscription,
  createSubscription,
  generateOrionEntity
};