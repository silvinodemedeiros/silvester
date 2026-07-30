#!/bin/sh

exec /usr/bin/contextBroker -fg -multiservice -disableFileLog \
  -dbURI "$ORION_MONGO_URI" \
  -logLevel "$ORION_LOG_LEVEL"