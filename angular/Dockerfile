# Stage 1: Build Angular app
FROM node:20-alpine AS build

WORKDIR /usr/src/app/silvester-angular
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve app with Nginx
FROM nginx:alpine

# Copy the built Angular app to Nginx's web root
COPY --from=build /usr/src/app/silvester-angular/dist/silvester-angular/browser /usr/share/nginx/html

# Copy custom Nginx config (optional, for SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
