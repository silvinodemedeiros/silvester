const WEATHER_DATA = {
    clouds: {
        type: 'Integer',
        metadata: {
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
        type: 'Integer',
        metadata: {
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
        type: 'Integer',
        metadata: {
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
        type: 'Integer',
        metadata: {
            icon: {
                value: 'bootstrapArrowDownRight',
                type: 'WeatherIconName'
            },
            measures: {
                value: 'numeric',
                type: 'WeatherValueUnit'
            }
        }
    },
    visibility: {
        type: 'Float',
        metadata: {
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