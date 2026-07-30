#!/bin/sh

exec /usr/bin/contextBroker \
  -dbURI "$ORION_MONGO_URI" \
  -logLevel "$ORION_LOG_LEVEL"