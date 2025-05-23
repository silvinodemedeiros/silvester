const WEATHER_DATA = {
    clouds: {
        type: 'Integer',
        metadata: {
            title: {
                value: 'Clouds',
                type: 'WeatherTitle'
            },
            icon: {
                value: 'bootstrapClouds',
                type: 'WeatherIconName'
            },
            measures: {
                value: 'percentage',
                type: 'WeatherValueUnit'
            }
        }
    },
    dew_point: {
        type: 'Float',
        metadata: {
            title: {
                value: 'Dew Point',
                type: 'WeatherTitle'
            },
            icon: {
                value: 'bootstrapDropletHalf',
                type: 'WeatherIconName'
            },
            measures: {
                value: 'temperature',
                type: 'WeatherValueUnit'
            }
        }
    },
    dt: {
        type: 'Time',
        metadata: {
            title: {
                value: 'Current Time',
                type: 'WeatherTitle'
            },
            icon: {
                value: 'bootstrapWatch',
                type: 'WeatherIconName'
            },
            measures: {
                value: 'time',
                type: 'WeatherValueUnit'
            }
        }
    },
    feels_like: {
        type: 'Float',
        metadata: {
            title: {
                value: 'Feels Like',
                type: 'WeatherTitle'
            },
            icon: {
                value: 'bootstrapEmojiSunglasses',
                type: 'WeatherIconName'
            },
            measures: {
                value: 'temperature',
                type: 'WeatherValueUnit'
            }
        }
    },
    humidity: {
        type: 'Integer',
        metadata: {
            title: {
                value: 'Humidity',
                type: 'WeatherTitle'
            },
            icon: {
                value: 'bootstrapDroplet',
                type: 'WeatherIconName'
            },
            measures: {
                value: 'percentage',
                type: 'WeatherValueUnit'
            }
        }
    },
    pressure: {
        type: 'Integer',
        metadata: {
            title: {
                value: 'Pressure',
                type: 'WeatherTitle'
            },
            icon: {
                value: 'bootstrapChevronBarDown',
                type: 'WeatherIconName'
            },
            measures: {
                value: 'hectoPascal',
                type: 'WeatherValueUnit'
            }
        }
    },
    sunrise: {
        type: 'Time',
        metadata: {
            title: {
                value: 'Sunrise',
                type: 'WeatherTitle'
            },
            icon: {
                value: 'bootstrapSunrise',
                type: 'WeatherIconName'
            },
            measures: {
                value: 'time',
                type: 'WeatherValueUnit'
            }
        }
    },
    sunset: {
        type: 'Time',
        metadata: {
            title: {
                value: 'Sunset',
                type: 'WeatherTitle'
            },
            icon: {
                value: 'bootstrapSunset',
                type: 'WeatherIconName'
            },
            measures: {
                value: 'time',
                type: 'WeatherValueUnit'
            }
        }
    },
    temp: {
        type: 'Float',
        metadata: {
            title: {
                value: 'Temperature',
                type: 'WeatherTitle'
            },
            icon: {
                value: 'bootstrapThermometerHalf',
                type: 'WeatherIconName'
            },
            measures: {
                value: 'temperature',
                type: 'WeatherValueUnit'
            }
        }
    },
    timezone: {
        type: 'Timezone',
        metadata: {
            title: {
                value: 'Timezone',
                type: 'WeatherTitle'
            },
            icon: {
                value: 'bootstrapClock',
                type: 'WeatherIconName'
            },
            measures: {
                value: 'timezone',
                type: 'WeatherValueUnit'
            }
        }
    },
    timezone_offset: {
        type: 'TimezoneOffset',
        metadata: {
            title: {
                value: 'Timezone Offset',
                type: 'WeatherTitle'
            },
            icon: {
                value: 'bootstrapClockFill',
                type: 'WeatherIconName'
            },
            measures: {
                value: 'timezoneOffset',
                type: 'WeatherValueUnit'
            }
        }
    },
    uvi: {
        type: 'Float',
        metadata: {
            title: {
                value: 'UVI',
                type: 'WeatherTitle'
            },
            icon: {
                value: 'bootstrapArrowDownRight',
                type: 'WeatherIconName'
            },
            measures: {
                value: 'angle',
                type: 'WeatherValueUnit'
            }
        }
    },
    visibility: {
        type: 'Float',
        metadata: {
            title: {
                value: 'Visibility',
                type: 'WeatherTitle'
            },
            icon: {
                value: 'bootstrapEye',
                type: 'WeatherIconName'
            },
            measures: {
                value: 'distance',
                type: 'WeatherValueUnit'
            }
        }
    },
    wind_deg: {
        type: 'Float',
        metadata: {
            title: {
                value: 'Wind Angle',
                type: 'WeatherTitle'
            },
            icon: {
                value: 'bootstrapArrowsMove',
                type: 'WeatherIconName'
            },
            measures: {
                value: 'angle',
                type: 'WeatherValueUnit'
            }
        }
    },
    wind_speed: {
        type: 'Float',
        metadata: {
            title: {
                value: 'Wind Speed',
                type: 'WeatherTitle'
            },
            icon: {
                value: 'bootstrapWind',
                type: 'WeatherIconName'
            },
            measures: {
                value: 'velocity',
                type: 'WeatherValueUnit'
            }
        }
    },
    wind_gust: {
        type: 'Float',
        metadata: {
            title: {
                value: 'Wind Gust',
                type: 'WeatherTitle'
            },
            icon: {
                value: 'bootstrapWind',
                type: 'WeatherIconName'
            },
            measures: {
                value: 'velocity',
                type: 'WeatherValueUnit'
            }
        }
    },
};

module.exports = {
    WEATHER_DATA
};