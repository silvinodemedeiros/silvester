const WEATHER_DATA = {
    clouds: {
        type: 'Integer',
        metadata: {
            icon: {
                value: 'bootstrapClouds',
                type: 'ClimateIconName'
            },
            measures: {
                value: 'percentage',
                type: 'ClimateValueUnit'
            }
        }
    },
    dew_point: {
        type: 'Float',
        metadata: {
            icon: {
                value: 'bootstrapDropletHalf',
                type: 'ClimateIconName'
            },
            measures: {
                value: 'temperature',
                type: 'ClimateValueUnit'
            }
        }
    },
    dt: {
        type: 'Integer',
        metadata: {
            icon: {
                value: 'bootstrapWatch',
                type: 'ClimateIconName'
            },
            measures: {
                value: 'time',
                type: 'ClimateValueUnit'
            }
        }
    },
    feels_like: {
        type: 'Float',
        metadata: {
            icon: {
                value: 'bootstrapEmojiSunglasses',
                type: 'ClimateIconName'
            },
            measures: {
                value: 'temperature',
                type: 'ClimateValueUnit'
            }
        }
    },
    humidity: {
        type: 'Integer',
        metadata: {
            icon: {
                value: 'bootstrapDroplet',
                type: 'ClimateIconName'
            },
            measures: {
                value: 'percentage',
                type: 'ClimateValueUnit'
            }
        }
    },
    pressure: {
        type: 'Integer',
        metadata: {
            icon: {
                value: 'bootstrapChevronBarDown',
                type: 'ClimateIconName'
            },
            measures: {
                value: 'hectoPascal',
                type: 'ClimateValueUnit'
            }
        }
    },
    sunrise: {
        type: 'Integer',
        metadata: {
            icon: {
                value: 'bootstrapSunrise',
                type: 'ClimateIconName'
            },
            measures: {
                value: 'time',
                type: 'ClimateValueUnit'
            }
        }
    },
    sunset: {
        type: 'Integer',
        metadata: {
            icon: {
                value: 'bootstrapSunset',
                type: 'ClimateIconName'
            },
            measures: {
                value: 'time',
                type: 'ClimateValueUnit'
            }
        }
    },
    temp: {
        type: 'Float',
        metadata: {
            icon: {
                value: 'bootstrapThermometerHalf',
                type: 'ClimateIconName'
            },
            measures: {
                value: 'temperature',
                type: 'ClimateValueUnit'
            }
        }
    },
    timezone: {
        type: 'Timezone',
        metadata: {
            icon: {
                value: 'bootstrapClock',
                type: 'ClimateIconName'
            },
            measures: {
                value: 'timezone',
                type: 'ClimateValueUnit'
            }
        }
    },
    timezone_offset: {
        type: 'Integer',
        metadata: {
            icon: {
                value: 'bootstrapClockFill',
                type: 'ClimateIconName'
            },
            measures: {
                value: 'offset',
                type: 'ClimateValueUnit'
            }
        }
    },
    uvi: {
        type: 'Integer',
        metadata: {
            icon: {
                value: 'bootstrapArrowDownRight',
                type: 'ClimateIconName'
            },
            measures: {
                value: 'numeric',
                type: 'ClimateValueUnit'
            }
        }
    },
    visibility: {
        type: 'Float',
        metadata: {
            icon: {
                value: 'bootstrapEye',
                type: 'ClimateIconName'
            },
            measures: {
                value: 'distance',
                type: 'ClimateValueUnit'
            }
        }
    },
    wind_deg: {
        type: 'Float',
        metadata: {
            icon: {
                value: 'bootstrapArrowsMove',
                type: 'ClimateIconName'
            },
            measures: {
                value: 'angle',
                type: 'ClimateValueUnit'
            }
        }
    },
    wind_speed: {
        type: 'Float',
        metadata: {
            icon: {
                value: 'bootstrapWind',
                type: 'ClimateIconName'
            },
            measures: {
                value: 'velocity',
                type: 'ClimateValueUnit'
            }
        }
    },
    wind_gust: {
        type: 'Float',
        metadata: {
            icon: {
                value: 'bootstrapWind',
                type: 'ClimateIconName'
            },
            measures: {
                value: 'velocity',
                type: 'ClimateValueUnit'
            }
        }
    },
};

module.exports = {
    WEATHER_DATA
};