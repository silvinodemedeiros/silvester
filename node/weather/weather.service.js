const axios = require('axios');
const { WEATHER_DATA } = require('./utils');

const lat = '-5.891076';
const lon = '-35.228625';
const apiKey = '65e9a19e408ce1c1f36a942069007c41';
const API_URL_ROOT = 'https://api.openweathermap.org/data/3.0/onecall?';
const WEATHER_API_URL = `${API_URL_ROOT}&units=metric&exclude=minutely,hourly,daily&lat=${lat}&lon=${lon}&appid=${apiKey}`;

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
        type: WEATHER_DATA[key].type,
        metadata: {...WEATHER_DATA[key].metadata}
      }
    };
  }, {
    id: "WeatherObserved:0001",
    type: "WeatherObserved",
    timezone: {
      type: WEATHER_DATA['timezone'].type,
      value: timezone,
      metadata: {...WEATHER_DATA['timezone'].metadata}
    },
    timezone_offset: {
      type: WEATHER_DATA['timezone_offset'].type,
      value: timezone_offset,
      metadata: {...WEATHER_DATA['timezone_offset'].metadata}
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