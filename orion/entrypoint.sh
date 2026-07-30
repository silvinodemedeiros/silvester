#!/bin/sh

exec /usr/bin/contextBroker -fg -multiservice -disableFileLog \
  -dbURI "$ORION_MONGO_URI" \
  -port "1026" \
  -logLevel "$ORION_LOG_LEVEL"