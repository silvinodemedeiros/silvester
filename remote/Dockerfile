# Use Alpine Linux
FROM alpine:latest

# Install docker CLI, docker-compose plugin and git
RUN apk add --no-cache \
    docker-cli \
    docker-cli-compose \
    git \
    bash

# Create working directory
WORKDIR /home/project

# Clone the repository
RUN git clone https://github.com/silvinodemedeiros/silvester.git

# Set working directory to cloned repo
WORKDIR /home/project/silvester

# Expose port 5200
EXPOSE 5200

# Default command
CMD ["docker", "compose", "up", "-d"]
