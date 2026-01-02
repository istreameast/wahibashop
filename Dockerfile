# --- build stage ---
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- run stage (static hosting) ---
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# SPA routing (React Router) support:
RUN printf '%s\n' \
'server {' \
'  listen 80;' \
'  server_name _;' \
'  root /usr/share/nginx/html;' \
'  index index.html;' \
'  location / {' \
'    try_files $uri $uri/ /index.html;' \
'  }' \
'}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
