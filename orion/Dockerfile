FROM fiware/orion:4.5.0

EXPOSE 1026

CMD sh -c 'exec /usr/bin/contextBroker -fg -multiservice -disableFileLog -dbURI "$ORION_MONGO_URI"'