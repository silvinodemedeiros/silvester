#!/bin/sh

exec contextBroker \
  -dbURI "$ORION_MONGO_URI" \
  -logLevel "$ORION_LOG_LEVEL"