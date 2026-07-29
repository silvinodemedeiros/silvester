FROM fiware/orion:4.5.0

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 1026

ENTRYPOINT ["/entrypoint.sh"]