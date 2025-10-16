# ----------------------
# 1. Build stage
# ----------------------
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ----------------------
# 2. Run stage
# ----------------------
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Alapértelmezett statikus fájlokat töröljük
RUN rm -rf ./*

# Buildelt fájlok bemásolása
COPY --from=build /app/build .

# Saját nginx konfiguráció másolása
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
