const WEATHER_DATA = {
    clouds: {
        type: 'clouds',
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
        type: 'dew_point',
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
        type: 'dt',
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
        type: 'feels_like',
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
        type: 'humidity',
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
        type: 'pressure',
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
        type: 'sunrise',
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
        type: 'sunset',
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
        type: 'temp',
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
        type: 'timezone',
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
        type: 'timezone_offset',
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
        type: 'uvi',
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
        type: 'visibility',
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
        type: 'wind_deg',
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
        type: 'wind_speed',
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
    }
};

module.exports = {
    WEATHER_DATA
};