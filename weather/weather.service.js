const axios = require('axios');
const { ICON_METADATA } = require('./utils');

const lat = '-5.891076';
const lon = '-35.228625';
const apiKey = '65e9a19e408ce1c1f36a942069007c41';
const API_URL_ROOT = 'https://api.openweathermap.org/data/3.0/onecall?';
const WEATHER_API_URL = `${API_URL_ROOT}&exclude=minutely,hourly,daily&lat=${lat}&lon=${lon}&appid=${apiKey}`;

function generateOrionEntity(weatherObject) {
  
  const {timezone, timezone_offset} = weatherObject;
    
  return Object.entries(weatherObject.current).reduce((acc, [key, value]) => {
    if (key === 'weather') {
      return acc;
    }
    
    return {
      ...acc,
      [key]: {
        value: value,
        type: "Number",
        metadata: {
          icon: {...ICON_METADATA[key]}
        }
      }
    };
  }, {
    id: "WeatherObserved:0001",
    type: "WeatherObserved",
    timezone: {
      type: "Timezone",
      value: timezone,
      metadata: {
        icon: {...ICON_METADATA['timezone']}
      }
    },
    timezone_offset: {
      type: "TimezoneOffset",
      value: timezone_offset,
      metadata: {
        icon: {...ICON_METADATA['timezone_offset']}
      }
    }
  });
}

async function getLocalWeather() {
  try {
    const response = await axios.get(WEATHER_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching entities:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = {
  generateOrionEntity,
  getLocalWeather
};