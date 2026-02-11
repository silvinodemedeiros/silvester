const SUBSCRIPTION_TEMPLATE = {
  "description": "Notify me when any attribute changes",
  "subject": {
    "entities": [
      {
        "id": "WeatherObserved:0001",
        "type": "WeatherObserved"
      }
    ],
    "condition": {
      "attrs": [
        "clouds",
        "dew_point",
        "dt",
        "feels_like",
        "humidity",
        "pressure",
        "sunrise",
        "sunset",
        "temp",
        "location",
        "timezone",
        "timezone_offset",
        "uvi",
        "visibility",
        "wind_deg",
        "wind_gust",
        "wind_speed"
      ]
    }
  },
  "notification": {
    "http": {
      "url": "http://host.docker.internal:3000/notify"
    },
    "attrs": [
      "clouds",
      "dew_point",
      "dt",
      "feels_like",
      "humidity",
      "pressure",
      "sunrise",
      "sunset",
      "temp",
      "location",
      "timezone",
      "timezone_offset",
      "uvi",
      "visibility",
      "wind_deg",
      "wind_gust",
      "wind_speed"
    ]
  },
  "expires": "2030-12-31T23:59:59.00Z",
  "throttling": 5
};

module.exports = {
    SUBSCRIPTION_TEMPLATE
};