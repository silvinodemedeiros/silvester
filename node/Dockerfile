FROM node:20-alpine

WORKDIR /usr/src/app/silvester-node

# Install dependencies
COPY package.json ./
RUN npm install --production

# Copy source code
COPY . .

EXPOSE 3000
CMD ["node", "index.js"]
